import { Upload } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router";
import TemplatesContext from "../../contexts/templatesContext";
import { DocumentData } from "../../types/doc";
import FileItem from "../../components/atoms/FileItem";

function Templates() {
  const { templates } = useContext(TemplatesContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between border-b">
          <h1 className="text-2xl font-bold text-neutral-800">Templates</h1>
          <div className="flex flex-row flex-wrap gap-3">
            <Link
              to="upload"
              className="bg-white p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
            >
              <Upload className="h-5 w-5" />
              Upload Template
            </Link>
          </div>
        </div>
      </header>
      <div className="p-6 flex flex-wrap gap-4">
        {templates.map((template: DocumentData) => (
          <Link
            to={template.id}
            key={template.id}
            className="flex flex-col relative w-full sm:w-40 h-40"
          >
            <FileItem label={template.metadata.fileName} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Templates;
