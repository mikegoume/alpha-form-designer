import { useMemo } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { fetchTemplates } from "../../api/templates";
import FileItem from "../../components/atoms/FileItem";
import FilterComponent from "../../components/molecules/LayoutFilters";
import TemplatesHeader from "../../components/molecules/TemplatesHeader";
import { useAuth } from "../../hooks/useAuth";
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

  if (isLoading || !templates) {
    return <p>Loading</p>;
  }

  const renderTemplates = (templatesList: Template[]) => {
    return templatesList.map((template) => (
      <Link
        to={`${template.id}`}
        key={template.id}
        className="flex flex-col relative w-full sm:w-40 h-40"
      >
        <FileItem label={template.name} />
      </Link>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplatesHeader />
      {isAdmin && <TemplateUpload />}
      <div className="flex flex-col gap-8">
        <div className="mx-8">
          <FilterComponent />
          <div className="grid grid-cols-10 gap-2">
            {renderTemplates(templates)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Templates;
