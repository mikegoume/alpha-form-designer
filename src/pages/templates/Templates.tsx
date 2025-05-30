import { useContext, useState } from "react";
import { Link } from "react-router";
import TemplatesContext from "../../contexts/templatesContext";
import { DocumentData } from "../../types/doc";
import FileItem from "../../components/atoms/FileItem";
import TemplatesHeader from "../../components/mollecules/TemplatesHeader";
import TabPanel from "../../components/atoms/TabPanel";
import TemplateUpload from "./TemplateUpload";
import { Typography } from "@mui/material";

function Templates() {
  const [tabValue, setTabValue] = useState(0);

  const { templates } = useContext(TemplatesContext);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderTemplates = (templatesList: DocumentData[]) => {
    return templatesList.map((template: DocumentData) => (
      <Link
        to={template.id}
        key={template.id}
        className="flex flex-col relative w-full sm:w-40 h-40"
      >
        <FileItem label={template.metadata.fileName} />
      </Link>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplatesHeader value={tabValue} handleChange={handleTabChange} />
      <TemplateUpload />
      <div className="flex flex-col gap-6">
        <div className="mx-8">
          <Typography variant="button">{"Recent Templates"}</Typography>
          {renderTemplates(templates)}
        </div>
        <div className="mx-8">
          <Typography variant="button">{"All Templates"}</Typography>
          <TabPanel value={tabValue} index={0}>
            {renderTemplates(templates)}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderTemplates(templates)}
          </TabPanel>
        </div>
      </div>
    </div>
  );
}

export default Templates;
