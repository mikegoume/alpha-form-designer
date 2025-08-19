import React, { useCallback, useRef, useState } from "react";
import { AlertCircle, Image, Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return false;
    }

    return true;
  };

  const handleFile = useCallback(
    (file: File) => {
      if (!validateFile(file)) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        setFileName(file.name);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setFileName("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={"w-full max-w-md mx-auto"}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : preview
              ? "border-green-400 bg-green-50"
              : error
                ? "border-red-400 bg-red-50"
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={"image/*"}
          onChange={handleFileInput}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg shadow-sm"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 truncate">{fileName}</p>
              <p className="text-xs text-green-600 mt-1">
                Image uploaded successfully
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div
                className={`p-3 rounded-full ${isDragging ? "bg-blue-100" : "bg-gray-100"}`}
              >
                {isDragging ? (
                  <Upload className="h-8 w-8 text-blue-500" />
                ) : (
                  <Image className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragging ? "Drop your image here" : "Upload an image"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to browse
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
