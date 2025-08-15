import { useNavigate } from "react-router";

import DocumentUploader from "../../components/molecules/DocumentUploader";
import { useSnackbar } from "../../contexts/SnackbarProvider";

function TemplateUpload() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleFileSelect = async (file: File) => {
    try {
      if (file) {
        showSnackbar("File uploaded successfully", "success");
      }

      navigate("/templates/create");
    } catch (error) {
      console.error("Error processing document:", error);
    }
  };

  return (
    <div className="m-8">
      <DocumentUploader onFileSelect={handleFileSelect} />
    </div>
  );
}

export default TemplateUpload;
