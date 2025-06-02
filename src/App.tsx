import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import Layout from "./components/organisms/Layout";
import TemplatesRouter from "./pages/templates";
import FormsRouter from "./pages/forms";
import TemplatesContext from "./contexts/templatesContext";
import { DocumentData } from "./types/doc";
import { FormConfig } from "./types/form";
import FormsContext from "./contexts/formsContext";
import AuthContext from "./contexts/auth/authContext";
import { User } from "./types/auth";
import Login from "./pages/Login";
import ProtectedRoute from "./components/atoms/ProtectedRoute";
import { SnackbarProvider } from "./contexts/SnackbarProvider";

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function handleSaveForm(form: FormConfig) {
    setForms([...forms, form]);
  }

  function handleSelectForm(formId: string) {
    setSelectedFormId(formId);
  }

  function handleSaveTemplate(template: DocumentData) {
    const index = templates.findIndex((t) => t.id === template.id);
    if (index > -1) {
      const newTemplates = [...templates];
      newTemplates[index] = template;
      setTemplates(newTemplates);
    } else {
      setTemplates([...templates, template]);
    }
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
        <AuthContext.Provider value={{ user, setUser }}>
          <SnackbarProvider>
            <Routes>
              <Route element={<ProtectedRoute user={user} />}>
                <Route element={<Layout />}>
                  <Route
                    path="/"
                    element={<Navigate to="/templates" replace />}
                  />
                  <Route path="/templates/*" element={<TemplatesRouter />} />
                  <Route path="/forms/*" element={<FormsRouter />} />
                </Route>
              </Route>
              <Route path="/login" element={<Login />} />
            </Routes>
          </SnackbarProvider>
        </AuthContext.Provider>
      </FormsContext.Provider>
    </TemplatesContext.Provider>
  );
}

export default App;
