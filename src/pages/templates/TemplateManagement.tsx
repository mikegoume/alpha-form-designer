import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DownloadIcon, Edit, FormInput } from "lucide-react";

import {
  fetchTemplate,
  updateTemplate,
  updateTemplateApiArgs,
} from "../../api/templates";
import DocumentPreview from "../../components/molecules/DocumentPreview";
import MetadataManager, {
  MetadataForm,
} from "../../components/molecules/MetadataManager";
import PlaceholderManager from "../../components/molecules/PlaceholderManager";
import TemplatesBuilderHeader from "../../components/molecules/TemplatesBuilderHeader";

function TemplateManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const client = useQueryClient();

  const [documentMetadata, setDocumentMetadata] = useState<
    MetadataForm | undefined
  >(undefined);
  const [isEditing, setIsEditing] = useState(false);

  const { data: templateData, isLoading } = useQuery({
    queryKey: ["template", id],
    queryFn: () => fetchTemplate(id as string),
    enabled: !!id,
  });

  const updateTemplateMutation = useMutation({
    mutationKey: ["update-template", id],
    mutationFn: (dataToUpdate: updateTemplateApiArgs) =>
      updateTemplate(dataToUpdate),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [id, "templates"] });
      setIsEditing(false);
    },
  });

  const template = templateData?.data;

  useEffect(() => {
    if (template && !documentMetadata) {
      setDocumentMetadata(() => ({
        fileName: template?.name ?? "",
        description: template?.description ?? "",
        tags: [],
      }));
    }
  }, [documentMetadata, template]);

  const onMetadataUpdate = (metadata: MetadataForm) => {
    console.log(metadata);
    setDocumentMetadata(metadata);
  };

  const handleEditorSave = () => {
    const dataToUpdate = {
      id: parseInt(id as string, 10),
      name: documentMetadata?.fileName ?? "",
      description: documentMetadata?.description ?? "",
      version: template?.version ?? "",
      filename: template?.filename ?? "",
      data: template?.data ?? "",
      creationTs: template?.creationTs ?? "",
    };

    updateTemplateMutation.mutate(dataToUpdate);
  };

  const isUploading = useMemo(() => template?.name === undefined, [template]);

  console.log(documentMetadata);

  const renderActionButtons = () => {
    if (isEditing) {
      return (
        <Button
          variant="contained"
          className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
          onClick={handleEditorSave}
          disabled={
            documentMetadata?.fileName === "" ||
            documentMetadata?.description === ""
          }
        >
          Save
        </Button>
      );
    } else {
      return isUploading ? (
        <Button
          variant="contained"
          className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
          // onClick={handleSaveDcument}
          disabled={isLoading}
        >
          <DownloadIcon className="h-4 w-4" />
          Save
        </Button>
      ) : (
        <div className="flex flex-row gap-6">
          <Button
            variant="contained"
            className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
            onClick={() => navigate("fill")}
          >
            <FormInput className="h-4 w-4" />
            Fill
          </Button>
          <Button
            variant="contained"
            className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      );
    }
  };

  return (
    template && (
      <div className="flex-1 flex flex-col bg-neutral-100">
        <TemplatesBuilderHeader
          title={isEditing ? "Edit Template" : "Template Preview"}
          actionButtons={renderActionButtons()}
        />
        <main className="flex flex-col flex-1 py-8 px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="space-y-6 col-span-2">
              <DocumentPreview document={template} />
            </div>
            <div className="space-y-6">
              <PlaceholderManager placeholders={template.placeholders} />
              <MetadataManager
                metadata={documentMetadata}
                showUpdateMetadataButton={isEditing}
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
