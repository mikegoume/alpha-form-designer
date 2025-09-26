import React from "react";

import { buttonTypes } from "../../pages/forms/constants";
import { ButtonType } from "../../types/form";
import { createButtonElement } from "../../utils/formUtils";

interface ElementsPanelProps {
  onAddElement: (element: any) => void;
}

const ElementsPanel: React.FC<ElementsPanelProps> = ({ onAddElement }) => {
  // Handle adding a button element
  const handleAddButton = (actionType: ButtonType) => {
    onAddElement(createButtonElement(actionType));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-medium text-gray-700">Form Actions</h2>
      </div>

      {/* Button Elements Section */}
      <div className="p-4">
        <h3 className="text-md font-medium text-gray-500 mb-3">
          Select Actions
        </h3>
        <h2 className="text-sm font-medium text-gray-500 mb-3">Form Actions</h2>
        <div className="flex flex-row gap-4 mb-3">
          {buttonTypes.map(
            (button, index) =>
              index === 0 && (
                <button
                  key={button.actionType}
                  onClick={() => handleAddButton(button.actionType)}
                  className="flex items-center p-2 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="mr-2 text-gray-500">{button.icon}</span>
                  <span className="text-sm">{button.label}</span>
                </button>
              ),
          )}
        </div>
        <h2 className="text-sm font-medium text-gray-500 mb-3">Form Buttons</h2>
        <div className="flex flex-row gap-4">
          {buttonTypes.map(
            (button, index) =>
              index > 0 && (
                <button
                  key={button.actionType}
                  onClick={() => handleAddButton(button.actionType)}
                  className="flex items-center p-2 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="mr-2 text-gray-500">{button.icon}</span>
                  <span className="text-sm">{button.label}</span>
                </button>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

export default ElementsPanel;
