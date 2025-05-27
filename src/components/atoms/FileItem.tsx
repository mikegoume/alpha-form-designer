import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { File } from "lucide-react";

import { DocumentData } from "../../types/doc";

type FileItemProperties = {
  item: DocumentData;
};

/**
 * The file item.
 */
function FileItem(properties: FileItemProperties) {
  const { item } = properties;

  if (!item) {
    return null;
  }

  return (
    <Box
      sx={{ backgroundColor: "background.paper" }}
      className="flex flex-col relative w-full sm:w-40 h-40 m-2 p-4 shadow-sm rounded-xl cursor-pointer"
    >
      <div className="flex flex-auto w-full items-center justify-center">
        <File />
      </div>
      <div className="flex shrink flex-col justify-center text-center">
        <Typography className="truncate text-md font-medium">
          {item.fileName}
        </Typography>
      </div>
    </Box>
  );
}

export default FileItem;
