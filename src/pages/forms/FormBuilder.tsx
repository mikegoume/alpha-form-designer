/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import {
  FormConfig,
  InputElement,
  ButtonElement,
  FormValues,
} from "../../types/form";
import ElementsPanel from "../../components/FormBuilder/ElementsPanel";
import FormPreview from "../../components/FormBuilder/FormPreview";
import PropertiesPanel from "../../components/FormBuilder/PropertiesPanel";
import { v4 as uuidv4 } from "uuid";
import FormAssociation from "../../components/FormBuilder/FormAssociation";
import FormsContext from "../../contexts/formsContext";
import { useNavigate } from "react-router";
import FormBuilderHeader from "../../components/FormBuilder/FormBuilderHeader";
import TemplatesContext from "../../contexts/templatesContext";

// Initial empty form configuration
export const initialFormConfig: FormConfig = {
  id: uuidv4(),
  name: "New Form",
  elements: [],
};

const FormBuilder: React.FC = () => {
  const { templates, onSaveTemplate } = useContext(TemplatesContext);
  const { onSaveForm } = useContext(FormsContext);
  const navigate = useNavigate();

  const [formConfig, setFormConfig] = useState<FormConfig>(initialFormConfig);
  const [associatedTemplateId, setAssociatedTemplateId] = useState<
    string | null
  >(null);
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

    setFormConfig((prevformconfig) => ({
      ...prevformconfig,
      elements: [...prevformconfig.elements, newElement],
    }));

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
    setFormValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
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
    onSaveForm(formConfig);
    const associatedTemplate = templates.find(
      (template) => template.id === associatedTemplateId
    );

    if (associatedTemplate) {
      onSaveTemplate({
        ...associatedTemplate,
        associatedFormId: [
          ...associatedTemplate.associatedFormId,
          formConfig.id,
        ],
      });
    }

    navigate("/forms");
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

  const handleResetConfig = () => {
    setFormConfig(initialFormConfig);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FormBuilderHeader
        formConfig={formConfig}
        setFormConfig={setFormConfig}
        handleNewForm={handleNewForm}
        handleSaveConfig={handleSaveConfig}
        handleLoadConfig={handleLoadConfig}
        previewMode={previewMode}
        togglePreviewMode={togglePreviewMode}
      />
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
            <div className="lg:col-span-3 flex flex-col gap-6">
              <FormAssociation
                associatedTemplateId={associatedTemplateId}
                setAssociatedTemplateId={setAssociatedTemplateId}
                onAddElement={handleAddElement}
                onResetConfig={handleResetConfig}
              />
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
