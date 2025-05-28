import { Routes, Route, Navigate } from "react-router";
import Layout from "./components/Layout";
import TemplatesRouter from "./pages/templates";
import FormsRouter from "./pages/forms";
import TemplatesContext from "./contexts/templatesContext";
import { useState } from "react";
import { DocumentData } from "./types/doc";
import { FormConfig } from "./types/form";
import FormsContext from "./contexts/formsContext";

function App() {
  const [templates, setTemplates] = useState<DocumentData[]>([]);
  const [selectedTemplateId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [uploadedTemplate, setUploadedTemplate] = useState<DocumentData | null>(
    null
  );
  const [forms, setForms] = useState<FormConfig[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  function handleSaveForm(form: FormConfig) {
    setForms([...forms, form]);
  }

  function handleSelectForm(formId: string) {
    setSelectedFormId(formId);
  }

  function handleSaveTemplate(template: DocumentData) {
    setTemplates([...templates, template]);
    setUploadedTemplate(null);
  }

  function handleSelectTemplate(templateId: string) {
    setSelectedElementId(templateId);
  }

  function handleUploadDocument(document: DocumentData) {
    setUploadedTemplate(document);
  }

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        selectedTemplateId,
        onSaveTemplate: handleSaveTemplate,
        onSelectTemplate: handleSelectTemplate,
        uploadedDocument: uploadedTemplate,
        onUploadDocument: handleUploadDocument,
      }}
    >
      <FormsContext.Provider
        value={{
          forms,
          selectedFormId,
          onSaveForm: handleSaveForm,
          onSelectForm: handleSelectForm,
        }}
      >
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/templates" replace />} />
            <Route path="/templates/*" element={<TemplatesRouter />} />
            <Route path="/forms/*" element={<FormsRouter />} />
          </Routes>
        </Layout>
      </FormsContext.Provider>
    </TemplatesContext.Provider>
  );
}

export default App;
