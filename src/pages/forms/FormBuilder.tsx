import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import {
  createForm,
  createFormApiArgs,
  fetchForm,
  updateForm,
  updateFormApiArgs,
} from "../../api/forms";
import { fetchTemplate } from "../../api/templates";
import ElementsPanel from "../../components/FormBuilder/ElementsPanel";
import FormAssociation from "../../components/FormBuilder/FormAssociation";
import FormPreview from "../../components/FormBuilder/FormPreview";
import PropertiesPanel from "../../components/FormBuilder/PropertiesPanel";
import FormBuilderHeader from "../../components/molecules/FormBuilderHeader";
import { FormConfig, FormValues, FormVariable } from "../../types/form";
import { Placeholder } from "../../types/templates";
import {
  createInputElement,
  transformTemplateFields,
} from "../../utils/formUtils";
import { initialFormConfig } from "./constants";

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();

  const { formId: id } = useParams();

  const saveFormMutation = useMutation({
    mutationKey: [id],
    mutationFn: (payload: createFormApiArgs) => createForm(payload),
    onSuccess: () => {
      navigate("/forms");
    },
  });

  const updateFormMutation = useMutation({
    mutationKey: [id],
    mutationFn: (payload: updateFormApiArgs) => updateForm(payload),
    onSuccess: () => {
      navigate("/forms");
    },
  });

  const [formConfig, setFormConfig] = useState<FormConfig>(initialFormConfig);
  const [associatedTemplateId, setAssociatedTemplateId] = useState("");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({});

  // console.log("formConfig: ", formConfig);
  // console.log("formValues: ", formValues);

  const { data: formData, isLoading: isFormsLoading } = useQuery({
    queryKey: ["form", id],
    queryFn: () => fetchForm(Number(id)),
    enabled: !!id && id !== "create",
  });

  const { data: template } = useQuery({
    queryKey: ["template", associatedTemplateId],
    queryFn: () => fetchTemplate(associatedTemplateId),
    enabled: !!associatedTemplateId, // Only run when templateId exists
  });

  const form = formData?.data;
  const extractedVariables = transformTemplateFields(
    template?.data.placeholders ?? [],
  );

  // Find the selected element from the form config
  const selectedElement = formConfig.formVariables.find(
    (formVariable) => formVariable.id === selectedElementId,
  );

  // Handle adding a new element to the form
  const handleAddElement = useCallback((element: any) => {
    setFormConfig((prevformconfig) => ({
      ...prevformconfig,
      formVariables: [
        ...prevformconfig.formVariables,
        { ...element, position: prevformconfig.formVariables.length + 1 },
      ],
    }));

    setSelectedElementId(element.id);
  }, []);

  useEffect(() => {
    if (form && formConfig.templateId === null) {
      const { json, ...rest } = form;
      const formVariables = JSON.parse(json).formVariables;

      setFormConfig({
        ...rest,
        formVariables,
      });

      setAssociatedTemplateId(String(form.templateId));
    }
  }, [form, formConfig.templateId]);

  useEffect(() => {
    if (associatedTemplateId !== "") {
      setFormConfig((prevFormConfig) => ({
        ...prevFormConfig,
        templateId: Number(associatedTemplateId),
      }));
    }
  }, [associatedTemplateId]);

  useEffect(() => {
    if (
      extractedVariables &&
      extractedVariables.length > 0 &&
      formConfig.formVariables.length < extractedVariables.length
    ) {
      setFormConfig((prevConfig) => ({ ...prevConfig, formVariables: [] }));
      extractedVariables.map((placeholder: Placeholder, index: number) => {
        handleAddElement(createInputElement(placeholder, index));
      });
    }
  }, [extractedVariables, formConfig.formVariables.length, handleAddElement]);

  // Handle updating an existing element
  const handleUpdateElement = (updatedElement: any) => {
    setFormConfig({
      ...formConfig,
      formVariables: formConfig.formVariables.map((el) =>
        el.id === updatedElement.id ? updatedElement : el,
      ),
    });
  };

  // Handle form values change
  const handleFormValueChange = (key: string, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  // Handle reordering formVariables
  const handleReorderFormVariables = (formVariables: any) => {
    setFormConfig({
      ...formConfig,
      formVariables,
    });
  };

  // Save the form configuration to JSON
  const handleSaveConfig = () => {
    if (id === "create" && formConfig.templateId !== null) {
      const saveFormPayload = {
        templateId: formConfig.templateId,
        name: formConfig.name,
        description: formConfig.description,
        version: formConfig.version,
        json: JSON.stringify(formConfig),
        status: formConfig.status,
      };

      saveFormMutation.mutate(saveFormPayload);
    } else {
      const saveFormPayload = {
        id: Number(id),
        templateId: formConfig.templateId,
        name: formConfig.name,
        description: formConfig.description,
        version: formConfig.version,
        json: JSON.stringify(formConfig),
        status: formConfig.status,
      };

      updateFormMutation.mutate(saveFormPayload);
    }
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    setSelectedElementId(null);
  };

  const handleResetConfig = () => {
    setFormConfig(initialFormConfig);
  };

  if (isFormsLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <FormBuilderHeader
        formConfig={formConfig}
        setFormConfig={setFormConfig}
        handleSaveConfig={handleSaveConfig}
        previewMode={previewMode}
        togglePreviewMode={togglePreviewMode}
      />
      <main className="flex flex-col flex-1 overflow-y-auto bg-neutral-100 p-4">
        {previewMode ? (
          <div className="max-w-2xl w-full mx-auto">
            <FormPreview
              formConfig={formConfig}
              formValues={formValues}
              onValueChange={handleFormValueChange}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <FormAssociation
                associatedTemplateId={associatedTemplateId}
                setAssociatedTemplateId={setAssociatedTemplateId}
                onResetConfig={handleResetConfig}
              />
              <ElementsPanel onAddElement={handleAddElement} />
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-medium text-gray-700">Form Preview</h2>
                </div>
                <div className="p-4">
                  <FormPreview
                    formConfig={formConfig}
                    formValues={formValues}
                    onValueChange={handleFormValueChange}
                    onSelectElement={setSelectedElementId}
                    selectedElementId={selectedElementId}
                    onReorderFormVariables={handleReorderFormVariables}
                    isEditable={true}
                  />
                </div>
              </div>
            </div>
            <AnimatePresence>
              {selectedElementId && (
                <>
                  {/* Overlay */}
                  <motion.div
                    className="fixed inset-0 bg-black bg-opacity-30 z-[100]"
                    onClick={() => setSelectedElementId(null)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />

                  {/* Close Button */}
                  <motion.button
                    onClick={() => setSelectedElementId(null)}
                    className="fixed top-4 right-[calc(100vw-100%+460px)] z-[600] bg-white rounded-full size-8 flex items-center justify-center shadow"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    ✕
                  </motion.button>

                  {/* Sliding Panel */}
                  <motion.div
                    className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg z-[500] border-l border-gray-200"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                  >
                    <PropertiesPanel
                      formConfig={formConfig}
                      element={selectedElement as FormVariable}
                      onUpdateElement={handleUpdateElement}
                      // onRemoveElement={handleRemoveElement}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </>
  );
};

export default FormBuilder;
