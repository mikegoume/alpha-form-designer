import { useMemo } from "react";
import { Link } from "react-router";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { fetchTemplates } from "../../api/templates";
import FileItem from "../../components/atoms/FileItem";
import FilterComponent from "../../components/molecules/LayoutFilters";
import TemplatesHeader from "../../components/molecules/TemplatesHeader";
import { useAuth } from "../../contexts/AuthContext";
import { Template } from "../../types/templates";
import TemplateUpload from "./TemplateUpload";

function Templates() {
  const { userType } = useAuth().user;

  const isAdmin = useMemo(() => {
    return userType === "admin";
  }, [userType]);

  const { data: templatesData, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  });

  const templates = templatesData?.data;

  const renderTemplates = (templatesList: Template[]) => {
    return templatesList.map((template) => (
      <Link
        to={`${template.id}`}
        key={template.id}
        className="flex flex-col items-center relative w-full sm:size-40 hover:cursor-pointer"
      >
        <FileItem label={template.name} />
      </Link>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplatesHeader />
      {isAdmin && <TemplateUpload />}
      <div className="flex flex-col gap-8 p-8">
        <FilterComponent />
        {isLoading || !templates ? (
          <div className="flex flex-col pt-20 justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] place-items-center">
            {renderTemplates(templates)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Templates;
