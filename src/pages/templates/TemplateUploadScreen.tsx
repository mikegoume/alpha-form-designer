import { motion } from "framer-motion";
import DocumentUploader from "../../components/DocsViewer/DocumentUploader";
import { v4 as uuidv4 } from "uuid";
import {
  convertDocxToHtml,
  extractPlaceholders,
} from "../../utils/documentUtils";
import { useContext } from "react";
import TemplatesContext from "../../contexts/templatesContext";
import { useNavigate } from "react-router";

function TemplateUploadScreen() {
  const navigate = useNavigate();
  const { onUploadDocument } = useContext(TemplatesContext);

  const handleFileSelect = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const htmlContent = await convertDocxToHtml(arrayBuffer);
      const extractedPlaceholders = extractPlaceholders(htmlContent);
      const uploadedDocument = {
        id: uuidv4(),
        file,
        content: htmlContent,
        fileName: file.name,
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
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Document Form Builder
        </h1>
        <p className="text-neutral-600 max-w-lg mx-auto">
          Upload a DOCX document, edit it to add placeholders, and create forms
          to fill your document with data.
        </p>
      </motion.div>
      <DocumentUploader onFileSelect={handleFileSelect} />
    </div>
  );
}

export default TemplateUploadScreen;
