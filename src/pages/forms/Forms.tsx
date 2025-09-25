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

  const { data: formsData, isLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: fetchForms,
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
          className="flex flex-col relative w-full sm:w-40 h-40"
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
        {isLoading || !forms ? (
          <div className="flex flex-col flex-1 justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-col overflow-y-auto">
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
