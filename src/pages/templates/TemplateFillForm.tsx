/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useMemo, useState } from "react";
import { useParams } from "react-router";
import TemplatesContext from "../../contexts/templatesContext";
import FormsContext from "../../contexts/formsContext";
import FormPreview from "../../components/FormBuilder/FormPreview";
import { FormValues } from "../../types/form";
import { renderAsync } from "docx-preview";

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
      selectedTemplate?.associatedFormId.includes(form.id)
    );
  }, [forms, selectedTemplate?.associatedFormId]);

  const handleFormValueChange = (key: string, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    // console.log("selectedTemplate: ", selectedTemplate);
    // console.log("formValues: ", formValues);
    setIsSubmitted(true);
    if (!!selectedTemplate && !!selectedTemplate.file && contentRef.current) {
      const arrayBuffer = selectedTemplate.file.arrayBuffer();
      renderAsync(arrayBuffer, contentRef.current);
    }
  };

  console.log(formValues);

  return (
    selectedForm && (
      <div className="max-w-4xl mx-auto">
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
