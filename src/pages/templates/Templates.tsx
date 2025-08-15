import { useMemo } from "react";
import { Link } from "react-router";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { fetchTemplates } from "../../api/templates";
import FileItem from "../../components/atoms/FileItem";
import { useAuth } from "../../hooks/useAuth";
import { DocumentData } from "../../types/doc";
import TemplateUpload from "./TemplateUpload";

function Templates() {
  const { userType } = useAuth().user;

  const isAdmin = useMemo(() => {
    return userType === "admin";
  }, [userType]);

  const { data: templatesData, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: () => fetchTemplates(),
  });

  const templates = templatesData?.data;

  if (isLoading || !templates) {
    return <p>Loading</p>;
  }

  const renderTemplates = (templatesList: DocumentData[]) => {
    return templatesList.map((template: DocumentData) => (
      <Link
        to={template.id}
        key={template.id}
        className="flex flex-col relative w-full sm:w-40 h-40"
      >
        <FileItem label={template.name} />
      </Link>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <TemplatesHeader value={tabValue} handleChange={handleTabChange} /> */}
      {isAdmin && <TemplateUpload />}
      <div className="flex flex-col gap-6">
        {templates.length > 0 && (
          <div className="mx-8">
            <Typography variant="button">Recent Templates</Typography>
            <div className="flex flex-row mt-4">
              {renderTemplates(templates)}
            </div>
          </div>
        )}
        {/* <div className="mx-8">
          <Typography variant="button">{"All Templates"}</Typography>
          <TabPanel value={tabValue} index={0}>
            {renderTemplates(templates)}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderTemplates(templates)}
          </TabPanel>
        </div> */}
      </div>
    </div>
  );
}

export default Templates;
