import { Route, Routes } from "react-router";
import TemplateManagement from "../templates/TemplateManagement";
import Templates from "../templates/Templates";
import TemplateUploadScreen from "./TemplateUploadScreen";

const TemplatesRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Templates />} />
      <Route path="/upload" element={<TemplateUploadScreen />} />
      <Route path="/:id" element={<TemplateManagement />} />
      <Route path="/:id/fill" element={<TemplateManagement />} />
    </Routes>
  );
};

export default TemplatesRouter;
