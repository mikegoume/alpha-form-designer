import { Route, Routes } from "react-router";
import TemplateManagement from "../templates/TemplateManagement";
import Templates from "../templates/Templates";
import TemplatesContext from "../../contexts/templatesContext";
import { DocumentData } from "../../types/doc";
import { useState } from "react";

const TemplatesRouter = () => {
  const [templates, setTemplates] = useState<DocumentData[]>([]);
  const [selectedTemplateId, setSelectedElementId] = useState<string | null>(
    null
  );

  function handleSaveTemplate(template: DocumentData) {
    setTemplates([...templates, template]);
  }

  function handleSelectTemplate(templateId: string) {
    setSelectedElementId(templateId);
  }

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        selectedTemplateId,
        onSaveTemplate: handleSaveTemplate,
        onSelectTemplate: handleSelectTemplate,
      }}
    >
      <Routes>
        <Route path="/" element={<Templates />} />
        <Route path="management" element={<TemplateManagement />} />
      </Routes>
    </TemplatesContext.Provider>
  );
};

export default TemplatesRouter;
