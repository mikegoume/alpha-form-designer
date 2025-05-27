import { Routes, Route, Navigate } from "react-router";
import Layout from "./components/Layout";
import FormBuilder from "./pages/FormBuilder";
import Templates from "./pages/Templates";
import TemplateManagement from "./pages/TemplateManagement";
import Forms from "./pages/Forms";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/templates" replace />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/management" element={<TemplateManagement />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/forms/:formId" element={<FormBuilder />} />
      </Routes>
    </Layout>
  );
}

export default App;
