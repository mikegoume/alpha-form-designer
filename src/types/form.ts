// Form builder types
export type InputType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "date";

export type ButtonActionType = "api" | "reset" | "submit" | "clear";

export interface FormElement {
  id: string;
  order: number;
}

export interface InputElement extends FormElement {
  type: InputType;
  label: string;
  key: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: string | number | boolean;
  validationRules?: ValidationRule[];
}

export interface ButtonElement extends FormElement {
  type: "button";
  label: string;
  actionType: ButtonActionType;
  targetKeys?: string[]; // Input keys this button will use/affect
  apiConfig?: APIConfig;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: string | number;
  message: string;
  validator?: (value: any) => boolean;
}

export interface APIConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: string; // Template string with {key} placeholders
  responseMapping?: Record<string, string>; // Maps API response keys to form input keys
}

export interface FormConfig {
  id: string;
  name: string;
  elements: (InputElement | ButtonElement)[];
}

export interface FormValues {
  [key: string]: any;
}

export interface FormBuilderState {
  config: FormConfig;
  selectedElementId: string | null;
  previewMode: boolean;
  formValues: FormValues;
}

export interface FormRendererProps {
  element: InputElement | ButtonElement;
  value?: any;
  onChange?: (value: any) => void;
  onButtonClick?: () => void;
}

export interface FormPreviewProps {
  config: FormConfig;
  formValues: FormValues;
  onValueChange: (key: string, value: any) => void;
  onSelectElement?: (id: string) => void;
  selectedElementId?: string | null;
  onReorderElements?: (elements: (InputElement | ButtonElement)[]) => void;
  isEditable?: boolean;
  onRemoveElement?: (id: string) => void;
}

export interface SortableItemProps {
  id: string;
  element: InputElement | ButtonElement;
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
  onRemoveElement?: (id: string) => void;
  formValues: FormValues;
  onValueChange: (key: string, value: any) => void;
  onButtonClick: () => void;
}
