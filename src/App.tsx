import { Routes, Route, Navigate } from "react-router";
import Layout from "./components/Layout";
import FormBuilder from "./pages/FormBuilder";
import Forms from "./pages/Forms";
import TemplatesRouter from "./pages/templates";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/templates" replace />} />
        <Route path="/templates/*" element={<TemplatesRouter />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/forms/:formId" element={<FormBuilder />} />
      </Routes>
    </Layout>
  );
}

export default App;
