import { useContext, useEffect, useMemo, useState } from "react";
import { DocumentData } from "../../types/doc";
import { extractPlaceholders } from "../../utils/documentUtils";

import DocumentEditor from "../../components/DocsViewer/DocumentEditor";
import DocumentPreview from "../../components/DocsViewer/DocumentPreview";
import PlaceholderManager from "../../components/DocsViewer/PlaceholderManager";
import TemplatesContext from "../../contexts/templatesContext";
import { useNavigate, useParams } from "react-router";
import MetadataManager, {
  MetadataForm,
} from "../../components/mollecules/MetadataManager";
import TemplatesBuilderHeader from "../../components/mollecules/TemplatesBuilderHeader";
import { Button } from "@mui/material";
import { DownloadIcon, Edit, FormInput } from "lucide-react";

function TemplateManagement() {
  const navigate = useNavigate();

  const { templates, uploadedDocument, onSaveTemplate } =
    useContext(TemplatesContext);

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { id } = useParams();

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

  const onMetadataUpdate = (metadata: MetadataForm) => {
    setDocument((prevDoc) =>
      prevDoc
        ? {
            ...prevDoc,
            metadata,
          }
        : null
    );
  };

  const isUploading = useMemo(() => !!uploadedDocument, [uploadedDocument]);

  const showUpdateMetadataButton = useMemo(() => {
    return !!uploadedDocument || isEditing;
  }, [isEditing, uploadedDocument]);

  function handleSaveDcument() {
    onSaveTemplate({ ...document });

    navigate("/templates");
  }

  const renderActionButtons = () => {
    if (isEditing) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEditorSave(document.content)}
        >
          Save
        </Button>
      );
    } else {
      return isUploading ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveDcument}
          className="bg-primary-500 text-white px-3 py-1.5 text-sm rounded flex items-center gap-1.5 hover:bg-primary-600 transition-colors"
        >
          <DownloadIcon className="h-4 w-4" />
          Save
        </Button>
      ) : (
        <div className="flex flex-row gap-6">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("fill")}
            className="text-neutral-600 hover:text-primary-500 px-3 py-1.5 text-sm rounded flex items-center gap-1.5 transition-colors"
          >
            <FormInput className="h-4 w-4" />
            Fill
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditing(true)}
            className="text-neutral-600 hover:text-primary-500 px-3 py-1.5 text-sm rounded flex items-center gap-1.5 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      );
    }
  };

  return (
    document && (
      <div className="flex-1 flex flex-col bg-neutral-100">
        <TemplatesBuilderHeader
          title={isEditing ? "Edit Template" : "Template Preview"}
          actionButtons={renderActionButtons()}
        />
        <main className="flex flex-col flex-1 container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6 col-span-2">
              {isEditing ? (
                <DocumentEditor
                  content={document?.content}
                  setContent={(content: string) =>
                    setDocument({ ...document, content })
                  }
                />
              ) : (
                <DocumentPreview document={document} />
              )}
            </div>
            <div className="space-y-6">
              <PlaceholderManager placeholders={document.placeholders} />
              <MetadataManager
                metadata={document.metadata}
                showUpdateMetadataButton={showUpdateMetadataButton}
                onSubmit={onMetadataUpdate}
              />
            </div>
          </div>
        </main>
      </div>
    )
  );
}

export default TemplateManagement;
