import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip } from "lucide-react";

import { SortableItemProps } from "../../types/form";
import FormRenderer from "../FormBuilder/FormRenderer";

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

export default SortableItem;
