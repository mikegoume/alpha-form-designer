import { Check, Circle, MousePointer } from "lucide-react";

import {
  ButtonTypeOption,
  FieldTypeOption,
  FieldTypes,
  FormConfig,
} from "../../types/form";

// Input type options
export const inputTypes: FieldTypeOption[] = [
  { type: FieldTypes.TEXT, label: "Text" },
  { type: FieldTypes.NUMBER, label: "Number" },
  { type: FieldTypes.DOUBLE, label: "Double" },
  { type: FieldTypes.BOOLEAN, label: "Boolean" },
  { type: FieldTypes.IMAGE, label: "Image" },
  { type: FieldTypes.LIST, label: "List" },
  { type: FieldTypes.TABLE, label: "Table" },
  { type: FieldTypes.DATETIME, label: "Datetime" },
];

// Button type options
export const buttonTypes: ButtonTypeOption[] = [
  {
    actionType: "api_call",
    label: "External Service",
    icon: <MousePointer size={18} />,
  },
  { actionType: "submit", label: "Submit", icon: <Check size={18} /> },
  { actionType: "reset", label: "Reset", icon: <Circle size={18} /> },
];

// Initial empty form configuration
export const initialFormConfig: FormConfig = {
  creationTs: new Date().toDateString(),
  description: "",
  name: "New Form",
  formVariables: [],
  status: "staged",
  templateId: null,
  version: "v1.0",
};
