import DocumentUploader from "../../components/DocsViewer/DocumentUploader";
import { v4 as uuidv4 } from "uuid";
import {
  convertDocxToHtml,
  extractPlaceholders,
} from "../../utils/documentUtils";
import { useContext } from "react";
import TemplatesContext from "../../contexts/templatesContext";
import { useNavigate } from "react-router";
import { useSnackbar } from "../../contexts/SnackbarProvider";

function TemplateUpload() {
  const navigate = useNavigate();
  const { onUploadDocument } = useContext(TemplatesContext);
  const { showSnackbar } = useSnackbar();

  const handleFileSelect = async (file: File) => {
    try {
      if (file) {
        showSnackbar("File uploaded successfully", "success");
      }
      const arrayBuffer = await file.arrayBuffer();
      const htmlContent = await convertDocxToHtml(arrayBuffer);
      const extractedPlaceholders = extractPlaceholders(htmlContent);
      const uploadedDocument = {
        id: uuidv4(),
        file,
        content: htmlContent,
        metadata: {
          fileName: file.name,
          description: "",
          tags: [],
        },
        placeholders: extractedPlaceholders,
        associatedFormId: [],
      };

      onUploadDocument(uploadedDocument);
      navigate(`/templates/${uploadedDocument.id}`);
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
