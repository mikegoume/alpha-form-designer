import { Typography } from "@mui/material";

function TemplatesHeader() {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 py-4 flex-col gap-4">
      <div className="px-8 flex flex-col justify-between">
        <p className="text-2xl font-semibold tracking-tight leading-8">
          Document Templates
        </p>
        <Typography
          className="font-medium tracking-tight"
          color="text.secondary"
        >
          Manage your templates
        </Typography>
      </div>
    </div>
  );
}

export default TemplatesHeader;
