import { createContext } from "react";

import { DocumentData } from "../types/doc";

const TemplatesContext = createContext<{
  templates: DocumentData[];
  selectedTemplateId: string | null;
  onSaveTemplate: (template: DocumentData) => void;
  onSelectTemplate: (templateId: string) => void;
  uploadedDocument: DocumentData | null;
  onUploadDocument: (document: DocumentData) => void;
}>({
  templates: [],
  selectedTemplateId: null,
  onSaveTemplate: () => {},
  onSelectTemplate: () => {},
  uploadedDocument: null,
  onUploadDocument: () => {},
});

export default TemplatesContext;
