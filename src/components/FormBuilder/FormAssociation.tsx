import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useQuery } from "@tanstack/react-query";

import { fetchTemplates } from "../../api/templates";

interface FormAssociationProps {
  associatedTemplateId: string | null;
  setAssociatedTemplateId: React.Dispatch<React.SetStateAction<string>>;
  onResetConfig: () => void;
}

function FormAssociation({
  associatedTemplateId,
  setAssociatedTemplateId,
  onResetConfig,
}: FormAssociationProps) {
  const { data: templatesData } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  });

  const templates = templatesData?.data;

  if (!templates) {
    return <p>Loading...</p>;
  }

  const handleTemplateSelect = (templateId: string) => {
    setAssociatedTemplateId(templateId);
    onResetConfig();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-medium text-gray-700">Form Template</h2>
      </div>

      {/* Input Elements Section */}
      <div className="h-full flex-1 p-4 border-b border-gray-200">
        <h3 className="text-md font-medium text-gray-500 mb-3">
          Select Template
        </h3>
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={associatedTemplateId}
            onChange={(e) => handleTemplateSelect(e.target.value as string)}
            sx={{ height: 40 }}
          >
            {templates.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {template.filename}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default FormAssociation;
