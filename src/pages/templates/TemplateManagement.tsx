import { useContext, useEffect, useMemo, useState } from "react";
import { DocumentData } from "../../types/doc";
import { extractPlaceholders } from "../../utils/documentUtils";

import DocumentEditor from "../../components/mollecules/DocumentEditor";
import DocumentPreview from "../../components/mollecules/DocumentPreview";
import PlaceholderManager from "../../components/mollecules/PlaceholderManager";
import TemplatesContext from "../../contexts/templatesContext";
import { useNavigate, useParams } from "react-router";
import MetadataManager, {
  MetadataForm,
} from "../../components/mollecules/MetadataManager";
import TemplatesBuilderHeader from "../../components/mollecules/TemplatesBuilderHeader";
import { DownloadIcon, Edit, FormInput } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function TemplateManagement() {
  const navigate = useNavigate();

  const { templates, uploadedDocument, onSaveTemplate } =
    useContext(TemplatesContext);
  const { userType } = useAuth().user;

  const isAdmin = useMemo(() => {
    return userType === "admin";
  }, [userType]);

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

  if (!document) {
    return;
  }

  function handleSaveDcument() {
    onSaveTemplate({ ...document });

    navigate("/templates");
  }

  const renderActionButtons = () => {
    if (isEditing) {
      return (
        <button
          className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
          onClick={() => handleEditorSave(document.content)}
        >
          Save
        </button>
      );
    } else {
      return isUploading ? (
        <button
          className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
          onClick={handleSaveDcument}
        >
          <DownloadIcon className="h-4 w-4" />
          Save
        </button>
      ) : (
        <div className="flex flex-row gap-6">
          <button
            className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
            onClick={() => navigate("fill")}
          >
            <FormInput className="h-4 w-4" />
            Fill
          </button>
          {isAdmin && (
            <button
              className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
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
