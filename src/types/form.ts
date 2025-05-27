/* eslint-disable @typescript-eslint/no-explicit-any */
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
  body?: Record<string, string>; // Maps request body fields to form input keys
  responseMapping?: Record<string, string>; // Maps API response keys to form input keys
  inputParams?: Record<string, string>; // Maps API parameter names to form input keys
}

export interface FormConfig {
  id: string;
  name: string;
  elements: (InputElement | ButtonElement)[];
}

export interface FormValues {
  [key: string]: any;
}

export interface InputTypeOption {
  type: InputType;
  label: string;
  icon: React.ReactNode;
}

export interface ButtonTypeOption {
  actionType: ButtonActionType;
  label: string;
  icon: React.ReactNode;
}
