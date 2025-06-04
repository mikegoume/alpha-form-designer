import React, { useContext, useMemo, useState } from "react";
import { useParams } from "react-router";
import { renderAsync } from "docx-preview";
import JSZip from "jszip";

import FormPreview from "../../components/FormBuilder/FormPreview";
import FilledTemplateHeader from "../../components/mollecules/FilledTemplateHeader";
import FormsContext from "../../contexts/formsContext";
import TemplatesContext from "../../contexts/templatesContext";
import { FormValues } from "../../types/form";

function TemplateFillForm() {
  const { templates } = useContext(TemplatesContext);
  const { forms } = useContext(FormsContext);
  const { id } = useParams();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const [formValues, setFormValues] = useState<FormValues>({});

  const selectedTemplate = useMemo(() => {
    return templates.find((template) => template.id === id);
  }, [id, templates]);

  const selectedForm = useMemo(() => {
    return forms.find((form) =>
      selectedTemplate?.associatedFormId.includes(form.id),
    );
  }, [forms, selectedTemplate?.associatedFormId]);

  const handleFormValueChange = (key: string, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);

    if (!!selectedTemplate?.file && contentRef.current) {
      try {
        const arrayBuffer = await selectedTemplate.file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        const docXmlPath = "word/document.xml";
        const xmlText = await zip.file(docXmlPath)?.async("text");

        if (!xmlText) {
          console.error("Unable to find document.xml in the .docx file.");
          return;
        }

        // Naive placeholder replacement — careful: tags must match exactly
        let replacedXml = xmlText;
        for (const [key, value] of Object.entries(formValues)) {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
          replacedXml = replacedXml.replace(regex, value ?? "");
        }

        // Replace updated XML in the zip
        zip.file(docXmlPath, replacedXml);

        // Generate new blob from updated zip
        const newBlob = await zip.generateAsync({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Render updated document into contentRef
        await renderAsync(newBlob, contentRef.current);
      } catch (err) {
        console.error("Error processing document:", err);
      }
    }
  };

  return (
    selectedForm && (
      <div className="">
        <FilledTemplateHeader showDownloadButton={isSubmitted} />
        <div
          className="flex-1 overflow-auto p-6 bg-neutral-50"
          ref={contentRef}
        />
        {!isSubmitted && (
          <FormPreview
            config={selectedForm}
            formValues={formValues}
            onValueChange={handleFormValueChange}
            onFormSubmit={handleSubmit}
          />
        )}
      </div>
    )
  );
}

export default TemplateFillForm;
