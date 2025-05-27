import { useCallback, useState } from "react";
import { DocumentData, Placeholder } from "../types/doc";
import {
  convertDocxToHtml,
  downloadDocument,
  extractPlaceholders,
  generateDocument,
} from "../utils/documentUtils";
import { motion } from "framer-motion";
import DocumentUploader from "../components/DocsViewer/DocumentUploader";
import DocumentEditor from "../components/DocsViewer/DocumentEditor";
import DocumentPreview from "../components/DocsViewer/DocumentPreview";
import PlaceholderManager from "../components/DocsViewer/PlaceholderManager";
import JsonFormBuilder from "../components/DocsViewer/JsonFormBuilder";

function TemplateManagement() {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState<"upload" | "edit">("upload");

  const handleFileSelect = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const htmlContent = await convertDocxToHtml(arrayBuffer);
      const extractedPlaceholders = extractPlaceholders(htmlContent);

      setDocument({
        file,
        content: htmlContent,
        fileName: file.name,
        placeholders: extractedPlaceholders,
      });

      setCurrentStep("edit");
    } catch (error) {
      console.error("Error processing document:", error);
    }
  };

  const handleEditorSave = (newContent: string) => {
    if (!document) return;

    const extractedPlaceholders = extractPlaceholders(newContent);

    setDocument({
      ...document,
      content: newContent,
      placeholders: extractedPlaceholders,
    });

    setIsEditing(false);
  };

  const handlePlaceholderAdded = (name: string) => {
    if (!document) return;

    const newPlaceholder: Placeholder = {
      id: `placeholder-${Date.now()}`,
      name,
    };

    setDocument({
      ...document,
      placeholders: [...document.placeholders, newPlaceholder],
    });
  };

  const handlePlaceholderRemoved = (id: string) => {
    if (!document) return;

    const placeholderToRemove = document.placeholders.find((p) => p.id === id);
    if (!placeholderToRemove) return;

    setDocument({
      ...document,
      placeholders: document.placeholders.filter((p) => p.id !== id),
    });
  };

  // const handleFormValueChange = (fieldId: string, value: string) => {
  //   setFormValues({
  //     ...formValues,
  //     [fieldId]: value,
  //   });
  // };

  const handleExport = async () => {
    if (!document?.content) return;

    try {
      const blob = await generateDocument(document.content, {});
      downloadDocument(blob, `filled_${document.fileName}`);
    } catch (error) {
      console.error("Error generating document:", error);
    }
  };

  const getPlaceholderNames = useCallback(() => {
    if (!document) return [];
    return document.placeholders.map((p) => p.name);
  }, [document]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <main className="flex-1 container mx-auto py-8 px-4">
        {currentStep === "upload" ? (
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
                Upload a DOCX document, edit it to add placeholders, and create
                forms to fill your document with data.
              </p>
            </motion.div>
            <DocumentUploader onFileSelect={handleFileSelect} />
          </div>
        ) : (
          document && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6 col-span-2">
                {isEditing ? (
                  <DocumentEditor
                    content={document.content}
                    setContent={(content: string) =>
                      setDocument({ ...document, content })
                    }
                    onSave={handleEditorSave}
                  />
                ) : (
                  <DocumentPreview
                    document={document}
                    onExport={handleExport}
                    onEdit={() => setIsEditing(true)}
                  />
                )}
              </div>
              <div className="space-y-6">
                <PlaceholderManager
                  placeholders={document.placeholders}
                  onPlaceholderAdded={handlePlaceholderAdded}
                  onPlaceholderRemoved={handlePlaceholderRemoved}
                />
                <JsonFormBuilder
                  formData={{ title: "", fields: [] }}
                  onFormUpdate={() => {}}
                  placeholderNames={getPlaceholderNames()}
                />
                {/* <FormRenderer
                  formData={formData}
                  formValues={formValues}
                  onFormValueChange={handleFormValueChange}
                /> */}
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default TemplateManagement;
