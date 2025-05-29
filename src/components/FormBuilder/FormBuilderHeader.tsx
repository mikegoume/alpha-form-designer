import { Play, Save } from "lucide-react";
import { ButtonElement, FormConfig } from "../../types/form";
import { IconButton } from "@mui/material";

interface IFormBuilderHeaderProps {
  formConfig: FormConfig;
  setFormConfig: React.Dispatch<React.SetStateAction<FormConfig>>;
  handleSaveConfig: () => void;
  previewMode: boolean;
  togglePreviewMode: () => void;
}
function FormBuilderHeader({
  formConfig,
  setFormConfig,
  handleSaveConfig,
  previewMode,
  togglePreviewMode,
}: IFormBuilderHeaderProps) {
  const isSaveDisabled =
    formConfig.elements.filter(
      (element) => (element as ButtonElement).actionType === "submit"
    ).length === 0;

  console.log(isSaveDisabled);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">
            Dynamic Form Builder
          </h1>
          <input
            type="text"
            value={formConfig.name}
            onChange={(e) =>
              setFormConfig((prevFormConfig: FormConfig) => ({
                ...prevFormConfig,
                name: e.target.value,
              }))
            }
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Form Name"
          />
        </div>

        <div className="flex items-center space-x-2">
          <IconButton
            disabled={isSaveDisabled}
            onClick={handleSaveConfig}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Save Form"
          >
            <Save size={18} />
          </IconButton>

          <IconButton
            onClick={togglePreviewMode}
            className={`p-2 rounded ${
              previewMode
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            title={previewMode ? "Exit Preview" : "Preview Form"}
          >
            <Play size={18} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

export default FormBuilderHeader;
