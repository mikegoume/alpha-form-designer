import { Button, TextField } from "@mui/material";
import { Play, Save } from "lucide-react";

import { ButtonElement, FormConfig } from "../../types/form";

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
      (element) => (element as ButtonElement).actionType === "submit",
    ).length === 0;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 pt-4 flex-col gap-4">
      <div className=" px-8 mb-8 flex items-start justify-between gap-12">
        <div className="gap-4 flex flex-col w-1/2">
          <h1 className="text-2xl font-bold text-neutral-800 inline">
            Dynamic Form Builder
          </h1>
          <TextField
            value={formConfig.name}
            fullWidth
            id="input-with-icon-textfield"
            onChange={(e) =>
              setFormConfig((prevFormConfig: FormConfig) => ({
                ...prevFormConfig,
                name: e.target.value,
              }))
            }
            placeholder="Form Name"
          />
        </div>
        <div className="flex flex-row gap-6">
          <Button
            variant="outlined"
            className={`bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2`}
            onClick={togglePreviewMode}
          >
            <Play size={18} />
            {previewMode ? "Exit Preview" : "Preview"}
          </Button>
          <Button
            variant="contained"
            className="bg-primary-500 text-white px-4 flex items-center gap-2 hover:bg-primary-600 transition-colors"
            onClick={handleSaveConfig}
            disabled={isSaveDisabled}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FormBuilderHeader;
