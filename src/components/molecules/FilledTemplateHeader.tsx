import { Button } from "@mui/material";
import { Download } from "lucide-react";

interface IFilledTemplateHeaderProps {
  showDownloadButton?: boolean;
  onDownloadClick?: () => void;
}

function FilledTemplateHeader({
  showDownloadButton,
  onDownloadClick,
}: IFilledTemplateHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 py-4 flex-col gap-4">
      <div className="px-8 flex flex-row justify-between">
        <p className="text-2xl font-semibold tracking-tight leading-8">
          Fill Template
        </p>
        {showDownloadButton && (
          <Button
            variant="contained"
            className="bg-primary-500 text-white px-4 flex flex-row items-center gap-2 hover:bg-primary-600 transition-colors"
            onClick={onDownloadClick}
          >
            <Download className="h-4 w-4" />
            Download DOCX
          </Button>
        )}
      </div>
    </div>
  );
}

export default FilledTemplateHeader;
