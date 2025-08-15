import { Form } from "./form";

export type Placeholder = {
  templateId: number;
  id: number;
  name: string;
  description: string;
  type: string;
  creationTs: string;
  legalValues: string;
  defaultValue: string;
  mask: string;
  extra: string;
};

export interface Template {
  id: number;
  name: string;
  description: string;
  version: string;
  filename: string;
  creationTs: string;
  data: string;
  placeholders: Placeholder[];
  forms: Form[];
}

export interface UploadPayload {
  id?: number;
  name?: string;
  description?: string;
  version?: string;
  filename: string;
  data: string;
}
