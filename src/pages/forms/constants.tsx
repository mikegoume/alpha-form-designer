import {
  AlignLeft,
  Calendar,
  Check,
  Circle,
  Hash,
  List,
  Lock,
  Mail,
  MousePointer,
  Square,
  Type,
} from "lucide-react";

import { ButtonTypeOption, InputTypeOption } from "../../types/form";

// Input type options
export const inputTypes: InputTypeOption[] = [
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
export const buttonTypes: ButtonTypeOption[] = [
  { actionType: "api", label: "API Call", icon: <MousePointer size={18} /> },
  { actionType: "submit", label: "Submit", icon: <Check size={18} /> },
  { actionType: "reset", label: "Reset", icon: <Circle size={18} /> },
  { actionType: "clear", label: "Clear", icon: <Circle size={18} /> },
];
