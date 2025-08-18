import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { renderAsync } from "docx-preview";
import { motion } from "framer-motion";
import { AlarmCheck as FormCheck, Download, FileText } from "lucide-react";

import { DocumentTemplate, generateDocument } from "../../api/endpoints";
import { fetchTemplates } from "../../api/templates";
import FormPreview from "../../components/FormBuilder/FormPreview";
import FilledTemplateHeader from "../../components/molecules/FilledTemplateHeader";
import { Form, FormConfig, FormValues } from "../../types/form";

function TemplateFillForm() {
  const { id } = useParams();

  const docxContainerRef = useRef<HTMLDivElement | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [selectedFormId, setSelectedFormId] = useState<number | string>("");
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const generateDoc = useMutation({
    mutationKey: [id],
    mutationFn: (data: DocumentTemplate) => generateDocument(data),
    onSuccess: async (data) => {
      console.log("data: ", data);

      const blob = new Blob([data], {
        type:
          selectedFormat === "PDF"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      if (selectedFormat === "PDF") {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } else if (selectedFormat === "DOCX" && docxContainerRef.current) {
        // Store the blob for download functionality
        setDocxBlob(blob);

        // Clear previous content
        docxContainerRef.current.innerHTML = "";
        await renderAsync(blob, docxContainerRef.current, undefined, {
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          className: "docx-preview",
        });
      }

      setShowFormatModal(false);
    },
  });

  const { data: templatesData } = useQuery({
    queryKey: ["templates", id],
    queryFn: fetchTemplates,
    enabled: !!id,
  });

  const templates = templatesData?.data;

  const selectedTemplate = useMemo(() => {
    return templates?.find((template) => template.id === Number(id));
  }, [id, templates]);

  const selectedForm = useMemo(() => {
    return selectedTemplate?.forms.find((form) => form.id === selectedFormId);
  }, [selectedFormId, selectedTemplate]);

  const formConfig = useMemo(() => {
    if (!selectedForm) return;

    return JSON.parse(selectedForm.json);
  }, [selectedForm]);

  const handleFormValueChange = (key: string, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const handleSubmit = async (format: string) => {
    if (!format) return;

    const dataToSend = {
      templateId: formConfig.templateId,
      templateVersion: formConfig.version,
      // issueDate: formConfig.creationTs,
      templateType: "DOCX",
      fileProperties: {
        fileName: formConfig.name,
        fileFormat: format,
        fileMetadata: {
          title: formConfig.name,
          author: "DocGen Author",
          subject: "DocGen Subject",
          keywords: "DocGen Keywords",
          creator: "DocGen Creator",
        },
      },
      metadata: {
        masterMetadata: {
          resolution: "HIGH",
          langId: "el-GR",
          restrictEditing: true,
          restrictionPassword: "123456",
        },
        templateMetadata: [
          ...(formConfig as FormConfig).formVariables
            .filter((v) => v.name && v.type && formValues[v.id] !== undefined)
            .map((v) => ({
              name: v.name,
              type: "TEXT",
              value: formValues[v.id],
            })),
        ],
      },
    };

    generateDoc.mutate(dataToSend);
  };

  const handleFormatSelect = (format: string) => {
    setSelectedFormat(format);
    handleSubmit(format);
  };

  const handleCloseModal = () => {
    setShowFormatModal(false);
  };

  const handleDownloadDocx = () => {
    if (!docxBlob || !formConfig) return;

    // Create download link
    const url = URL.createObjectURL(docxBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formConfig.name || "document"}.docx`;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  return selectedFormat === "PDF" && pdfUrl ? (
    <iframe
      src={pdfUrl}
      title={`${selectedFormat} Preview`}
      width="100%"
      height="100%"
      style={{ border: "none" }}
    />
  ) : selectedFormat === "DOCX" ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white shadow-apple overflow-hidden flex flex-col h-full"
    >
      {/* Download Button Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex justify-between items-center">
        <Typography variant="h6" className="text-gray-700">
          Document Preview
        </Typography>
        <Button
          variant="contained"
          onClick={handleDownloadDocx}
          startIcon={<Download className="h-4 w-4" />}
          disabled={!docxBlob}
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Download DOCX
        </Button>
      </div>

      {/* Document Preview Container */}
      <div className="flex-1 overflow-auto p-4">
        <div ref={docxContainerRef} />
      </div>
    </motion.div>
  ) : (
    selectedTemplate && (
      <>
        <FilledTemplateHeader showDownloadButton={false} />
        <div className="flex flex-col flex-1 items-center gap-6 p-4 bg-neutral-100">
          {selectedTemplate.forms.length >= 1 && (
            <FormControl
              sx={{ width: "100%", backgroundColor: "white", maxWidth: 500 }}
            >
              <InputLabel id="demo-simple-select-label">Select Form</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="select-form-label"
                label="Select Form"
                value={selectedFormId}
                onChange={(e) => setSelectedFormId(e.target.value)}
              >
                {selectedTemplate?.forms.map((opt: Form) => (
                  <MenuItem key={opt.id} value={opt.id}>
                    <ListItemText primary={opt.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <div className="bg-white rounded-xl shadow-lg w-[1000px]">
            {formConfig ? (
              <FormPreview
                formConfig={formConfig}
                formValues={formValues}
                onValueChange={handleFormValueChange}
                onFormSubmit={() => setShowFormatModal(true)}
              />
            ) : (
              <div className="h-[300px] flex flex-col justify-center items-center gap-4 text-gray-500">
                <FormCheck className="size-16 text-gray-300" />
                <p className="text-lg">
                  Please select a form from the dropdown above
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Format Selection Modal */}
        <Dialog
          open={showFormatModal}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <Download className="h-5 w-5" />
              <Typography variant="h6">Select Document Format</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Choose the format you want to download your document in:
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => handleFormatSelect("PDF")}
                startIcon={<FileText className="h-5 w-5" />}
                sx={{
                  py: 2,
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  "&:hover": {
                    borderColor: "#d32f2f",
                    backgroundColor: "rgba(211, 47, 47, 0.04)",
                  },
                }}
              >
                PDF Format
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => handleFormatSelect("DOCX")}
                startIcon={<FileText className="h-5 w-5" />}
                sx={{
                  py: 2,
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#1976d2",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                DOCX Format
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="inherit">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  );
}

export default TemplateFillForm;
