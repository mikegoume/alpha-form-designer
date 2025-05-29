import { useContext } from "react";
import { ButtonElement, InputElement } from "../../types/form";
import TemplatesContext from "../../contexts/templatesContext";
import { createInputElement } from "../../pages/forms/helpers";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

interface FormAssociationProps {
  associatedTemplateId: string | null;
  setAssociatedTemplateId: (templateId: string | null) => void;
  onAddElement: (element: InputElement | ButtonElement) => void;
  onResetConfig: () => void;
}

function FormAssociation({
  associatedTemplateId,
  setAssociatedTemplateId,
  onAddElement,
  onResetConfig,
}: FormAssociationProps) {
  const { templates } = useContext(TemplatesContext);

  const handleTemplateSelect = (templateId: string) => {
    setAssociatedTemplateId(templateId);
    onResetConfig();
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
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={associatedTemplateId}
            onChange={(e) => handleTemplateSelect(e.target.value as string)}
          >
            {templates.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {template.fileName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default FormAssociation;
