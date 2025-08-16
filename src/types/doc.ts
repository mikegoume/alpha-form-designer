export interface FormField {
  id: string;
  type: "text" | "number" | "select" | "checkbox" | "date";
  label: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  defaultValue?: string | number | boolean;
}

export interface JsonFormData {
  title: string;
  fields: FormField[];
}

export interface DocumentData {
  id: string;
  file: File;
  content: string;
  metadata: {
    fileName: string;
    description: string;
    tags: string[];
  };
  placeholders: Placeholder[];
  associatedFormId: string[];
}
