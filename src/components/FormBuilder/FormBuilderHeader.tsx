import { FileUp, Play, Plus, Save } from "lucide-react";
import { FormConfig } from "../../types/form";

function FormBuilderHeader({
  formConfig,
  setFormConfig,
  handleNewForm,
  handleSaveConfig,
  handleLoadConfig,
  previewMode,
  togglePreviewMode,
}) {
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
          <button
            onClick={handleNewForm}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="New Form"
          >
            <Plus size={18} />
          </button>

          <button
            onClick={handleSaveConfig}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Save Form"
          >
            <Save size={18} />
          </button>

          <label
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer"
            title="Load Form"
          >
            <FileUp size={18} />
            <input
              type="file"
              accept=".json"
              onChange={handleLoadConfig}
              className="hidden"
            />
          </label>

          <button
            onClick={togglePreviewMode}
            className={`p-2 rounded ${
              previewMode
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            title={previewMode ? "Exit Preview" : "Preview Form"}
          >
            <Play size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default FormBuilderHeader;
