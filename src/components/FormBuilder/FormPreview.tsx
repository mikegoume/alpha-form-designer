import React from "react";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip } from "lucide-react";

import {
  ButtonElement,
  FormConfig,
  FormValues,
  SortableItemProps,
} from "../../types/form";
import FormRenderer from "./FormRenderer";

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  element,
  selectedElementId,
  onSelectElement,
  formValues,
  onValueChange,
  onButtonClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg overflow-hidden transition-all ${
        isDragging
          ? "shadow-lg ring-2 ring-blue-400"
          : selectedElementId === element.id
            ? "border-blue-500 ring-2 ring-blue-200"
            : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onSelectElement && onSelectElement(element.id)}
    >
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
        >
          <Grip size={16} />
        </div>
        <div className="text-xs font-medium text-gray-500">
          {"type" in element
            ? element.type.charAt(0).toUpperCase() + element.type.slice(1)
            : "Button"}
        </div>
        <div />
      </div>

      <div className="p-3">
        <FormRenderer
          element={element}
          value={formValues["key" in element ? element.key : ""]}
          onChange={(value) => {
            if ("key" in element) {
              onValueChange(element.key, value);
            }
          }}
          onButtonClick={onButtonClick}
        />
      </div>
    </div>
  );
};

interface FormPreviewProps {
  formConfig: FormConfig;
  formValues: FormValues;
  onValueChange: (key: string, value: any) => void;
  onSelectElement?: React.Dispatch<React.SetStateAction<string | null>>;
  selectedElementId?: string | null;
  onReorderElements?: (formVariables: any) => void;
  isEditable?: boolean;
  onRemoveElement?: (elementId: string) => void;
  onFormSubmit?: () => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  formConfig,
  formValues,
  onValueChange,
  onSelectElement,
  selectedElementId,
  onReorderElements,
  isEditable = false,
  onRemoveElement,
  onFormSubmit,
}) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  // Handle API call simulation
  const handleApiCall = async (buttonElement: ButtonElement) => {
    if (!buttonElement.apiConfig) return;

    const {
      url,
      method,
      // headers = {},
      responseMapping = {},
      inputParams = {},
    } = buttonElement.apiConfig;

    try {
      // Replace URL parameters with input values
      let finalUrl = url;
      Object.values(inputParams).forEach((inputKey) => {
        const value = formValues[inputKey];

        if (value !== undefined) {
          finalUrl = finalUrl.concat(`/${value}`);
        }
      });

      const response = await fetch(finalUrl, {
        method,
        // headers,
      }).then((res) => res.json());

      // Update form values based on response mapping
      Object.values(responseMapping).forEach((formKey) => {
        if (response[formKey] !== undefined) {
          onValueChange(formKey, response[formKey]);
        }
      });

      return response;
    } catch (error) {
      console.error("API call failed:", error);
      return null;
    }
  };

  // Handle button click based on action type
  const handleButtonClick = async (buttonElement: ButtonElement) => {
    switch (buttonElement.actionType) {
      case "api":
        return await handleApiCall(buttonElement);

      case "reset":
        // Reset form to default values
        formConfig.formVariables.forEach((element) => {
          if ("key" in element && element.defaultValue !== undefined) {
            onValueChange(element.key, element.defaultValue);
          }
        });
        break;

      case "clear":
        // Clear all form values
        formConfig.formVariables.forEach((element) => {
          if ("key" in element) {
            onValueChange(element.key, "");
          }
        });
        break;

      case "submit":
        // Handle form submission (just log values for demo)
        // console.log('Form submitted with values:', formValues);
        if (onFormSubmit) {
          onFormSubmit();
        }
        // alert(
        //   "Form submitted with values: " + JSON.stringify(formValues, null, 2)
        // );
        break;
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !onReorderElements) return;

    const oldIndex = formConfig.formVariables.findIndex(
      (el) => el.id === active.id,
    );
    const newIndex = formConfig.formVariables.findIndex(
      (el) => el.id === over.id,
    );

    const items = Array.from(formConfig.formVariables);
    const [reorderedItem] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, reorderedItem);

    // Update the order property for each item
    const reorderedElements = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    onReorderElements(reorderedElements);
  };

  if (isEditable) {
    return (
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {formConfig.formVariables.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
            <p className="text-gray-500">
              Add form formVariables from the left panel{" "}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[900px]">
            <SortableContext
              items={formConfig.formVariables.map((el) => el.id)}
              strategy={verticalListSortingStrategy}
            >
              {formConfig?.formVariables
                .sort((a, b) => a.position - b.position)
                .map((element) => (
                  <SortableItem
                    key={element.id}
                    id={element.id}
                    element={element}
                    selectedElementId={selectedElementId}
                    onSelectElement={onSelectElement}
                    onRemoveElement={onRemoveElement}
                    formValues={formValues}
                    onValueChange={onValueChange}
                    onButtonClick={handleButtonClick}
                  />
                ))}
            </SortableContext>
          </div>
        )}
      </DndContext>
    );
  }

  // Non-editable preview mode
  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">{formConfig.name}</h2>

      {formConfig.formVariables
        .sort((a, b) => a.position - b.position)
        .map((element) => (
          <div key={element.id} className="mb-4">
            <FormRenderer
              element={element}
              value={formValues["key" in element ? element.key : ""]}
              onChange={(value) => {
                if ("key" in element) {
                  onValueChange(element.key, value);
                }
              }}
              onButtonClick={() => {
                if ("actionType" in element) {
                  handleButtonClick(element);
                }
              }}
            />
          </div>
        ))}
    </div>
  );
};

export default FormPreview;
