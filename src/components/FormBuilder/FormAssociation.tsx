import { useContext, useState } from "react";
import { ButtonElement, InputElement } from "../../types/form";
import TemplatesContext from "../../contexts/templatesContext";
import { createInputElement } from "../../pages/forms/helpers";

interface FormAssociationProps {
  onAddElement: (element: InputElement | ButtonElement) => void;
  onResetConfig: () => void;
}

function FormAssociation({
  onAddElement,
  onResetConfig,
}: FormAssociationProps) {
  const { templates } = useContext(TemplatesContext);

  const [templateId, setTemplateId] = useState<string | undefined>(undefined);

  const handleTemplateSelect = (templateId: string) => {
    onResetConfig();
    setTemplateId(templateId);
    const selectedTemplate = templates.find(
      (template) => String(template.id) === templateId
    );

    if (selectedTemplate) {
      selectedTemplate.placeholders.map((placeholder) => {
        onAddElement(createInputElement("text", placeholder.name));
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-medium text-gray-700">Form Association</h2>
      </div>

      {/* Input Elements Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Templates</h3>
        <select
          value={templateId}
          onChange={(e) => handleTemplateSelect(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.fileName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FormAssociation;
