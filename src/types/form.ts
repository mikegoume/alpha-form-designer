import { ReactNode } from "react";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { Dayjs } from "dayjs";

export interface Form {
  templateId: number;
  id: number;
  name: string;
  description: string;
  creationTs: string;
  version: string;
  json: string;
  status: string;
}

export interface ButtonElement {
  id: string;
  position: number;
  type: "button";
  label: string;
  actionType: ButtonType;
  targetKeys?: string[]; // Input keys this button will use/affect
  serviceIdToLoad?: number;
  serviceParams?: any[];
  responseMapping?: ResponseMapping[];
  resultType?: "array" | "object";
}

export type FormInputElementType = {
  templateId: number;
  id: number | string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string | number | boolean | PickerValue | undefined | null;
  maxLength?: number;
  columns?: Column[];
  minDate?: string;
  maxDate?: string;
  mask?: string;
  creationTs: string; // ISO 8601 timestamp
  description: string | null;
  legalValues: string[] | null;
  position: number;
  serviceIdToLoad?: number;
  requestParameters: any[];
};

export type FormVariable = FormInputElementType | ButtonElement;

export interface FormConfig {
  id?: number;
  templateId: number | null;
  name: string;
  description: string;
  version: string;
  creationTs: string;
  formVariables: FormVariable[];
  status: string;
}

export type FormValues = Record<string, any>;

export interface FieldTypeOption {
  type: FieldType;
  label: string;
}

export interface ButtonTypeOption {
  actionType: ButtonType;
  label: string;
  icon: React.ReactNode;
}

export interface SortableItemProps {
  id: string | number;
  element: any;
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
  onRemoveElement?: (id: string) => void;
  formValues: FormValues;
  onValueChange: (key: string, value: any) => void;
  onButtonClick: (buttonElement: ButtonElement) => Promise<null | undefined>;
}

export enum FieldTypes {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  DOUBLE = "DOUBLE",
  BOOLEAN = "BOOLEAN",
  IMAGE = "IMAGE",
  LIST = "LIST",
  TABLE = "TABLE",
  DATETIME = "DATETIME",
}

export type FieldType =
  | "TEXT"
  | "NUMBER"
  | "DOUBLE"
  | "BOOLEAN"
  | "IMAGE"
  | "LIST"
  | "TABLE"
  | "DATETIME";

export type ButtonType = "api_call" | "submit" | "reset";
export type ParamType = "hardcoded" | "input_key";

export interface ServiceParam {
  key: string;
  type: ParamType;
  value: string; // Either hardcoded value or input field name
}

export interface ResponseMapping {
  targetInput: string;
}

export interface Column {
  name: string;
  type: string | number | boolean | Dayjs | null | ReactNode;
}
