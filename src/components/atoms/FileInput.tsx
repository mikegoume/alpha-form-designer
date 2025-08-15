import { useRef, useState } from "react";
import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import { HardDrive, Trash2, UploadCloud } from "lucide-react";

import { convertToBase64 } from "../../utils/formUtils";

const DropZone = styled(Paper)<{ dragactive?: boolean }>(
  ({ theme, dragactive }) => ({
    border: `2px dashed ${dragactive ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(6),
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    backgroundColor: dragactive
      ? theme.palette.primary.main + "0A"
      : "transparent",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main + "05",
    },
  }),
);

const FilePreview = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.grey[50],
  marginTop: theme.spacing(2),
}));

function FileInput({ value = null, handleChange, accept = "image/*" }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(value);
  const [base64Data, setBase64Data] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsLoading(true);

    try {
      const base64 = await convertToBase64(selectedFile);
      handleChange(base64);
      setBase64Data(base64);
    } catch (error) {
      console.error("Error converting file to base64:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setBase64Data("");
    handleChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <Box>
      <DropZone
        dragactive={dragActive}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {!file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-primary-100 p-3 rounded-full">
              <UploadCloud className="size-8 text-primary-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-neutral-800">
                Upload your image
              </p>
              <p className="text-neutral-500 mt-1">
                Drag and drop your file here, or click to select
              </p>
            </div>
            <Button variant="contained" color="primary">
              Select File
            </Button>
          </div>
        ) : (
          <Box className="p-4">
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <CircularProgress size={20} />
                <Typography variant="body2">Converting to base64...</Typography>
              </Box>
            ) : (
              <FilePreview>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <HardDrive color="action" />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={removeFile}
                  size="medium"
                  className="hover:text-error-500"
                >
                  <Trash2 className="size-5 " />
                </IconButton>
              </FilePreview>
            )}
          </Box>
        )}

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept={accept}
        />
      </DropZone>
    </Box>
  );
}

export default FileInput;
