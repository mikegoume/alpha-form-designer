import React, { useState } from "react";
import {
  FormConfig,
  InputElement,
  ButtonElement,
  FormValues,
} from "../../types/form";
import ElementsPanel from "./ElementsPanel";
import FormPreview from "./FormPreview";
import PropertiesPanel from "./PropertiesPanel";
import { v4 as uuidv4 } from "uuid";
import { Plus, Save, Play, FileUp } from "lucide-react";

// Initial empty form configuration
const initialFormConfig: FormConfig = {
  id: uuidv4(),
  name: "New Form",
  elements: [],
};

const FormBuilder: React.FC = () => {
  const [formConfig, setFormConfig] = useState<FormConfig>(initialFormConfig);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({});

  // Find the selected element from the form config
  const selectedElement = formConfig.elements.find(
    (el) => el.id === selectedElementId
  );

  // Handle adding a new element to the form
  const handleAddElement = (element: InputElement | ButtonElement) => {
    const newOrder =
      formConfig.elements.length > 0
        ? Math.max(...formConfig.elements.map((el) => el.order)) + 1
        : 0;

    const newElement = {
      ...element,
      id: uuidv4(),
      order: newOrder,
    };

    setFormConfig({
      ...formConfig,
      elements: [...formConfig.elements, newElement],
    });

    setSelectedElementId(newElement.id);
  };

  // Handle updating an existing element
  const handleUpdateElement = (
    updatedElement: InputElement | ButtonElement
  ) => {
    setFormConfig({
      ...formConfig,
      elements: formConfig.elements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      ),
    });
  };

  // Handle removing an element
  const handleRemoveElement = (elementId: string) => {
    setFormConfig({
      ...formConfig,
      elements: formConfig.elements.filter((el) => el.id !== elementId),
    });

    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  // Handle form values change
  const handleFormValueChange = (key: string, value: any) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  // Handle reordering elements
  const handleReorderElements = (
    elements: (InputElement | ButtonElement)[]
  ) => {
    setFormConfig({
      ...formConfig,
      elements,
    });
  };

  // Save the form configuration to JSON
  const handleSaveConfig = () => {
    const configJson = JSON.stringify(formConfig, null, 2);
    const blob = new Blob([configJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${formConfig.name.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load a form configuration from JSON
  const handleLoadConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string) as FormConfig;
        setFormConfig(config);
        setSelectedElementId(null);
        setFormValues({});
      } catch (error) {
        console.error("Error parsing form configuration:", error);
        alert("Invalid form configuration file");
      }
    };
    reader.readAsText(file);

    // Reset the input value so the same file can be loaded again
    event.target.value = "";
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    setSelectedElementId(null);
  };

  // Reset form to a new empty configuration
  const handleNewForm = () => {
    if (formConfig.elements.length > 0) {
      if (
        !confirm(
          "Are you sure you want to create a new form? Any unsaved changes will be lost."
        )
      ) {
        return;
      }
    }

    setFormConfig({
      ...initialFormConfig,
      id: uuidv4(),
    });
    setSelectedElementId(null);
    setFormValues({});
    setPreviewMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">
              Dynamic Form Builder
            </h1>
            <input
              type="text"
              value={formConfig.name}
              onChange={(e) =>
                setFormConfig({ ...formConfig, name: e.target.value })
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {previewMode ? (
          <div className="max-w-2xl mx-auto">
            <FormPreview
              config={formConfig}
              formValues={formValues}
              onValueChange={handleFormValueChange}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel - Elements */}
            <div className="lg:col-span-3">
              <ElementsPanel onAddElement={handleAddElement} />
            </div>

            {/* Middle Panel - Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-medium text-gray-700">Form Preview</h2>
                </div>
                <div className="p-4">
                  <FormPreview
                    config={formConfig}
                    formValues={formValues}
                    onValueChange={handleFormValueChange}
                    onSelectElement={setSelectedElementId}
                    selectedElementId={selectedElementId}
                    onReorderElements={handleReorderElements}
                    isEditable={true}
                    onRemoveElement={handleRemoveElement}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Properties */}
            <div className="lg:col-span-4">
              <PropertiesPanel
                element={selectedElement}
                onUpdateElement={handleUpdateElement}
                onRemoveElement={handleRemoveElement}
                formElements={formConfig.elements}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FormBuilder;
