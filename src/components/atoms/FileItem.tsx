import Typography from "@mui/material/Typography";

import MyIcon from "../../../assets/docx-image.png";
import FormIcon from "../../../assets/form2.png";
import ServiceIcon from "../../../assets/service-icon.png";

type FileItemProperties = {
  label: string;
  isForm?: boolean;
  isService?: boolean;
};

/**
 * The file item.
 */
function FileItem(properties: FileItemProperties) {
  const { label, isForm, isService } = properties;

  if (!label) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center gap-2 max-w-[100px}]`}>
      <div className="flex flex-auto items-center justify-center relative">
        {/* <StatusBadge status="published" /> */}
        <img
          src={isForm ? FormIcon : isService ? ServiceIcon : MyIcon}
          alt="Description"
        />
      </div>
      <div className="flex shrink flex-col justify-center text-center overflow-hidden w-full">
        <Typography className="truncate text-ellipsis whitespace-nowrap text-md font-medium">
          {label}
        </Typography>
      </div>
    </div>
  );
}

export default FileItem;
