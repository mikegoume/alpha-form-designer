import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTemplate, createTemplateApiArgs } from "../../api/templates";
import DocumentUploader from "../../components/molecules/DocumentUploader";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import { fileToBase64 } from "../../utils/documentUtils";

function TemplateUpload() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const client = useQueryClient();

  const uploadTemplateMutation = useMutation({
    mutationKey: ["upload-template"],
    mutationFn: (data: createTemplateApiArgs) => createTemplate(data),
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["templates"] });
      if (data?.data?.id) {
        navigate("/templates/" + data?.data?.id);
      }
    },
  });

  const handleFileSelect = async (file: File) => {
    try {
      if (file) {
        showSnackbar("File uploaded successfully", "success");
      }

      const filedata = (await fileToBase64(file)).split(",")[1];

      const templateToUploadData = {
        filename: file.name,
        data: filedata,
      };

      console.log(templateToUploadData);

      uploadTemplateMutation.mutate(templateToUploadData);
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
