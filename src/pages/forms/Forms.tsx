import { Upload } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router";
import FormsContext from "../../contexts/formsContext";
import { FormConfig } from "../../types/form";
import FileItem from "../../components/atoms/FileItem";

function Forms() {
  const { forms } = useContext(FormsContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-800">Forms</h1>
          <div className="flex gap-3">
            <Link
              to="create"
              className="bg-white p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
            >
              <Upload className="h-5 w-5" />
              Create Form
            </Link>
          </div>
        </div>
      </header>
      <div className="p-6">
        {forms.map((form: FormConfig) => (
          <Link to={form.id} key={form.id}>
            <FileItem key={form.id} label={form.name} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Forms;
