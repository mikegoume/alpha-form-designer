import { Link } from "react-router";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { fetchForms } from "../../api/forms";
import FileItem from "../../components/atoms/FileItem";
import FormsHeader from "../../components/molecules/FormsHeader";
import FilterComponent from "../../components/molecules/LayoutFilters";
import { useAuth } from "../../contexts/AuthContext";
import { Form } from "../../types/form";

function Forms() {
  const {
    user: { isAdmin },
  } = useAuth();

  const {
    data: formsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["forms"],
    queryFn: fetchForms,
    retry: 5, // retry up to 5 times
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // exponential backoff (max 30s)
  });

  const forms = formsData?.data;

  const renderForms = (formsList: Form[]) => {
    return formsList.map((form: Form) => {
      const linkTo = isAdmin
        ? `${form.id}`
        : `/templates/${form.templateId}/fill`;

      return (
        <Link
          to={linkTo}
          key={form.id}
          state={{ formId: form.id }} // 👈 pass data here
          className="flex flex-col relative w-full sm:size-40"
        >
          <FileItem label={form.name} isForm={true} />
        </Link>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FormsHeader />
      <div className="flex flex-1 flex-col gap-8 p-8 overflow-auto">
        <FilterComponent />
        {isLoading && (
          <div className="flex flex-col flex-1 justify-center items-center">
            <CircularProgress />
          </div>
        )}

        {isError && (
          <div className="flex flex-col pt-20 justify-center items-center text-red-600">
            <p>Something went wrong! Failed to load forms.</p>
            <p className="text-sm text-gray-500">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        )}

        {!isLoading && !isError && forms && (
          <div className="flex flex-col ">
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] place-items-center">
              {renderForms(forms)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Forms;
