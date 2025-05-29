import { useContext, useEffect, useState } from "react";
import { DocumentData, Placeholder } from "../../types/doc";
import {
  downloadDocument,
  extractPlaceholders,
  generateDocument,
} from "../../utils/documentUtils";

import DocumentEditor from "../../components/DocsViewer/DocumentEditor";
import DocumentPreview from "../../components/DocsViewer/DocumentPreview";
import PlaceholderManager from "../../components/DocsViewer/PlaceholderManager";
import TemplatesContext from "../../contexts/templatesContext";
import { useParams } from "react-router";

function TemplateManagement() {
  const { templates, uploadedDocument } = useContext(TemplatesContext);

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { id } = useParams();

  console.log(document);

  useEffect(() => {
    if (uploadedDocument) {
      setDocument(uploadedDocument);
    } else if (id) {
      const template = templates.find((template) => template.id === id);
      if (template) {
        setDocument(template);
      }
    }
  }, [id, templates, uploadedDocument]);

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

  const handleExport = async () => {
    if (!document?.content) return;

    try {
      const blob = await generateDocument(document.content, {});
      downloadDocument(blob, `filled_${document.fileName}`);
    } catch (error) {
      console.error("Error generating document:", error);
    }
  };

  const handleEditDocumentName = (newName: string) => {
    setDocument((prevDoc) =>
      prevDoc
        ? {
            ...prevDoc,
            fileName: newName,
          }
        : null
    );
  };

  return (
    document && (
      <div className="min-h-screen flex flex-col bg-neutral-100">
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6 col-span-2">
              {isEditing ? (
                <DocumentEditor
                  content={document?.content}
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
                  onEditDocumentName={handleEditDocumentName}
                />
              )}
            </div>
            <div className="space-y-6">
              <PlaceholderManager
                placeholders={document.placeholders}
                onPlaceholderAdded={handlePlaceholderAdded}
                onPlaceholderRemoved={handlePlaceholderRemoved}
              />
            </div>
          </div>
        </main>
      </div>
    )
  );
}

export default TemplateManagement;
