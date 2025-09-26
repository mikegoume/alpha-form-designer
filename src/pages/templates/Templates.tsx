import { Link } from "react-router";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { fetchTemplates } from "../../api/templates";
import FileItem from "../../components/atoms/FileItem";
import FilterComponent from "../../components/molecules/LayoutFilters";
import TemplatesHeader from "../../components/molecules/TemplatesHeader";
import { Template } from "../../types/templates";
import TemplateUpload from "./TemplateUpload";

function Templates() {
  const {
    data: templatesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
    retry: 5, // retry up to 5 times
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // exponential backoff (max 30s)
  });

  const templates = templatesData?.data;

  const renderTemplates = (templatesList: Template[]) => {
    return templatesList.map((template) => (
      <Link
        to={`${template.id}`}
        key={template.id}
        className="flex flex-col items-center relative sm:size-40 hover:cursor-pointer"
      >
        <FileItem label={template.name} />
      </Link>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplatesHeader />
      <TemplateUpload />
      <div className="flex flex-col gap-8 p-8 overflow-auto">
        <FilterComponent />
        {isLoading && (
          <div className="flex flex-col pt-20 justify-center items-center">
            <CircularProgress />
          </div>
        )}

        {isError && (
          <div className="flex flex-col pt-20 justify-center items-center text-red-600">
            <p>Something went wrong! Failed to load templates.</p>
            <p className="text-sm text-gray-500">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        )}

        {!isLoading && !isError && templates && (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] place-items-center">
            {renderTemplates(templates)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Templates;
