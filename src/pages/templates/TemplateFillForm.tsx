/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router";
import TemplatesContext from "../../contexts/templatesContext";
import FormsContext from "../../contexts/formsContext";
import FormPreview from "../../components/FormBuilder/FormPreview";
import { FormValues } from "../../types/form";

function TemplateFillForm() {
  const { templates } = useContext(TemplatesContext);
  const { forms } = useContext(FormsContext);
  const { id } = useParams();

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
    console.log("selectedTemplate: ", selectedTemplate);
    console.log("formValues: ", formValues);
  };

  return (
    selectedForm && (
      <div className="max-w-2xl mx-auto">
        <FormPreview
          config={selectedForm}
          formValues={formValues}
          onValueChange={handleFormValueChange}
          onFormSubmit={handleSubmit}
        />
      </div>
    )
  );
}

export default TemplateFillForm;
