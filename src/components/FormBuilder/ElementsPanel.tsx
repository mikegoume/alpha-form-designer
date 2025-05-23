import React from "react";
import {
  InputElement,
  ButtonElement,
  InputType,
  ButtonActionType,
} from "../../types/form";
import { v4 as uuidv4 } from "uuid";
import {
  Type,
  Hash,
  Mail,
  Lock,
  List,
  Check,
  Circle,
  AlignLeft,
  Calendar,
  Square,
  MousePointer,
} from "lucide-react";

interface ElementsPanelProps {
  onAddElement: (element: InputElement | ButtonElement) => void;
}

interface InputTypeOption {
  type: InputType;
  label: string;
  icon: React.ReactNode;
}

interface ButtonTypeOption {
  actionType: ButtonActionType;
  label: string;
  icon: React.ReactNode;
}

const ElementsPanel: React.FC<ElementsPanelProps> = ({ onAddElement }) => {
  // Input type options
  const inputTypes: InputTypeOption[] = [
    { type: "text", label: "Text", icon: <Type size={18} /> },
    { type: "number", label: "Number", icon: <Hash size={18} /> },
    { type: "email", label: "Email", icon: <Mail size={18} /> },
    { type: "password", label: "Password", icon: <Lock size={18} /> },
    { type: "select", label: "Dropdown", icon: <List size={18} /> },
    { type: "checkbox", label: "Checkbox", icon: <Square size={18} /> },
    { type: "radio", label: "Radio", icon: <Circle size={18} /> },
    { type: "textarea", label: "Text Area", icon: <AlignLeft size={18} /> },
    { type: "date", label: "Date", icon: <Calendar size={18} /> },
  ];

  // Button type options
  const buttonTypes: ButtonTypeOption[] = [
    { actionType: "api", label: "API Call", icon: <MousePointer size={18} /> },
    { actionType: "submit", label: "Submit", icon: <Check size={18} /> },
    { actionType: "reset", label: "Reset", icon: <Circle size={18} /> },
    { actionType: "clear", label: "Clear", icon: <Circle size={18} /> },
  ];

  // Create a base input element
  const createInputElement = (type: InputType): InputElement => ({
    id: uuidv4(),
    type,
    label: `${type.charAt(0).toUpperCase() + type.slice(1)} Input`,
    key: `${type}_${Date.now()}`,
    placeholder: `Enter ${type}...`,
    order: 0,
    required: false,
    options:
      type === "select" || type === "radio"
        ? [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ]
        : undefined,
  });

  // Create a base button element
  const createButtonElement = (
    actionType: ButtonActionType
  ): ButtonElement => ({
    id: uuidv4(),
    type: "button",
    label: actionType.charAt(0).toUpperCase() + actionType.slice(1),
    actionType,
    order: 0,
    variant: "primary",
    size: "md",
    apiConfig:
      actionType === "api"
        ? {
            url: "https://api.example.com/data",
            method: "GET",
            headers: { "Content-Type": "application/json" },
            responseMapping: {},
          }
        : undefined,
  });

  // Handle adding an input element
  const handleAddInput = (type: InputType) => {
    onAddElement(createInputElement(type));
  };

  // Handle adding a button element
  const handleAddButton = (actionType: ButtonActionType) => {
    onAddElement(createButtonElement(actionType));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-medium text-gray-700">Form Elements</h2>
      </div>

      {/* Input Elements Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Input Fields</h3>
        <div className="grid grid-cols-2 gap-2">
          {inputTypes.map((input) => (
            <button
              key={input.type}
              onClick={() => handleAddInput(input.type)}
              className="flex items-center p-2 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <span className="mr-2 text-gray-500">{input.icon}</span>
              <span className="text-sm">{input.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Button Elements Section */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Buttons</h3>
        <div className="grid grid-cols-2 gap-2">
          {buttonTypes.map((button) => (
            <button
              key={button.actionType}
              onClick={() => handleAddButton(button.actionType)}
              className="flex items-center p-2 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <span className="mr-2 text-gray-500">{button.icon}</span>
              <span className="text-sm">{button.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElementsPanel;
