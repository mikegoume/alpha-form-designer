import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { renderAsync } from "docx-preview";
import { AlarmCheck as FormCheck, Download, FileText } from "lucide-react";

import { DocumentTemplate, generateDocument } from "../../api/endpoints";
import { fetchTemplates } from "../../api/templates";
import FormPreview from "../../components/FormBuilder/FormPreview";
import FilledTemplateHeader from "../../components/molecules/FilledTemplateHeader";
import { useAuth } from "../../contexts/AuthContext";
import { Form, FormValues } from "../../types/form";
import { prepareDataToGenerateDocument } from "../../utils/documentUtils";

function TemplateFillForm() {
  const location = useLocation();
  const { id } = useParams();
  const {
    user: { isAdmin },
  } = useAuth();

  const { formId } = location.state || {};

  const docxContainerRef = useRef<HTMLDivElement | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [selectedFormId, setSelectedFormId] = useState<number | string>("");
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [showLoading, setShowLoading] = useState(false);

  const generateDoc = useMutation({
    mutationKey: [id],
    mutationFn: (data: DocumentTemplate) => {
      setShowLoading(true);
      return generateDocument(data); // ✅ return promise
    },
    onSuccess: async (data) => {
      setShowLoading(false);
      const blob = new Blob([data], {
        type:
          selectedFormat === "PDF"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      setGeneratedBlob(blob);

      if (selectedFormat === "PDF") {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      }

      // ✅ Close modals after success
      setShowFormatModal(false);
      setShowLockModal(false);
    },
    onError: () => {
      setShowLoading(false);
    },
  });

  // Render DOCX once blob and container are ready
  useEffect(() => {
    if (
      selectedFormat === "DOCX" &&
      generatedBlob &&
      docxContainerRef.current
    ) {
      docxContainerRef.current.innerHTML = "";
      renderAsync(generatedBlob, docxContainerRef.current, undefined, {
        inWrapper: false,
        ignoreWidth: false,
        ignoreHeight: false,
      });
    }
  }, [selectedFormat, generatedBlob]);

  useEffect(() => {
    if (!isAdmin && formId) {
      setSelectedFormId(formId);
    }
  }, [formId, isAdmin]);

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
    setFormValues((prevValues) => ({ ...prevValues, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedFormat) return;

    const dataToSend = prepareDataToGenerateDocument(
      selectedFormat,
      formConfig,
      formValues,
      isLocked,
    );
    generateDoc.mutate(dataToSend);
  };

  const handleFormatSelect = (format: string) => {
    setSelectedFormat(format);
    if (format === "DOCX") {
      setShowLockModal(true);
    } else {
      handleSubmit(); // ✅ don’t close modal early
    }
  };

  const handleLockSelect = (locked: boolean) => {
    setIsLocked(locked);
    handleSubmit();
  };

  const handleCloseModal = () => {
    if (showLoading) return; // ✅ prevent closing while loading
    setShowFormatModal(false);
    setShowLockModal(false);
  };

  const handleDownload = () => {
    if (!generatedBlob || !selectedFormat) return;
    const url = URL.createObjectURL(generatedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = selectedFormat === "PDF" ? "document.pdf" : "document.docx";
    link.click();
  };

  // Full screen preview
  if (pdfUrl || (selectedFormat === "DOCX" && generatedBlob)) {
    return (
      <div className="w-full h-full flex flex-col">
        <FilledTemplateHeader
          showDownloadButton={!!generatedBlob && selectedFormat === "DOCX"}
          onDownloadClick={handleDownload}
        />
        <div className="w-full h-full bg-black/60 flex flex-col items-center justify-center">
          {selectedFormat === "PDF" && pdfUrl && (
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
          {selectedFormat === "DOCX" && (
            <div
              ref={docxContainerRef}
              className="overflow-y-auto min-w-2xl bg-white shadow-xl rounded-lg"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    selectedTemplate && (
      <>
        <FilledTemplateHeader
          showDownloadButton={!!generatedBlob && selectedFormat === "DOCX"}
          onDownloadClick={handleDownload}
        />
        <div className="flex flex-col flex-1 items-center gap-6 p-4 bg-neutral-100">
          {selectedTemplate.forms.length > 0 && isAdmin && (
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
              Choose the format you want to generate your document in:
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => handleFormatSelect("PDF")}
                startIcon={
                  showLoading && selectedFormat === "PDF" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )
                }
                sx={{
                  py: 2,
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  "&:hover": {
                    borderColor: "#d32f2f",
                    backgroundColor: "rgba(211, 47, 47, 0.04)",
                  },
                }}
                disabled={showLoading}
              >
                {showLoading && selectedFormat === "PDF"
                  ? "Generating..."
                  : "PDF Format"}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => handleFormatSelect("DOCX")}
                startIcon={
                  showLoading && selectedFormat === "DOCX" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )
                }
                sx={{
                  py: 2,
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#1976d2",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
                disabled={showLoading}
              >
                {showLoading && selectedFormat === "DOCX"
                  ? "Generating..."
                  : "DOCX Format"}
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModal}
              color="inherit"
              disabled={showLoading}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Lock Selection Modal */}
        <Dialog
          open={showLockModal && selectedFormat === "DOCX"}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <Download className="h-5 w-5" />
              <Typography variant="h6">DOCX Download Options</Typography>
            </Box>
          </DialogTitle>

          <DialogContent>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Configure your DOCX document options:
            </Typography>

            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                p: 2,
                backgroundColor: "#fafafa",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isLocked}
                    onChange={(e) => setIsLocked(e.target.checked)}
                  />
                }
                label={
                  <Typography fontWeight={600}>
                    Lock document for editing
                  </Typography>
                }
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                When enabled, the document will be protected from modifications
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setShowLockModal(false);
                setShowFormatModal(true); // go back
              }}
              color="inherit"
              disabled={showLoading}
            >
              Back
            </Button>
            <Button
              onClick={() => handleLockSelect(isLocked)}
              variant="contained"
              color="primary"
              startIcon={
                showLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Download />
                )
              }
              disabled={showLoading}
            >
              {showLoading ? "Generating..." : "Download DOCX"}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  );
}

export default TemplateFillForm;
