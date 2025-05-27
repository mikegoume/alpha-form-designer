import { Upload } from "lucide-react";
import { Link } from "react-router";

function Templates() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between border-b">
          <h1 className="text-2xl font-bold text-neutral-800">Templates</h1>
          <div className="flex gap-3">
            <Link
              to="management"
              className="bg-white p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
            >
              <Upload className="h-5 w-5" />
              Upload Template
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Templates;
