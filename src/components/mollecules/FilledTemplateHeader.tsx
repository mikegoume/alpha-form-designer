import { Button } from "@mui/material";

interface IFilledTemplateHeaderProps {
  showDownloadButton?: boolean;
}

function FilledTemplateHeader({
  showDownloadButton,
}: IFilledTemplateHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container px-8 mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">Fill Template</h1>
        {showDownloadButton && (
          <Button variant="contained" color="primary">
            Download
          </Button>
        )}
      </div>
    </div>
  );
}

export default FilledTemplateHeader;
