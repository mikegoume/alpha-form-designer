import { useNavigate } from "react-router";
import { Box, Tab, Tabs } from "@mui/material";
import { Plus } from "lucide-react";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface IFormsHeaderProps {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
}

function FormsHeader({ value, handleChange }: IFormsHeaderProps) {
  const navigate = useNavigate();
  const handleCreatePress = () => {
    navigate("create");
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className=" px-8 mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">Forms</h1>
        <button
          className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
          onClick={handleCreatePress}
        >
          <Plus className="h-4 w-4" />
          Create Form
        </button>
      </div>
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 4 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="My Forms" {...a11yProps(0)} />
          <Tab label="Available Forms" {...a11yProps(1)} />
        </Tabs>
      </Box>
    </div>
  );
}

export default FormsHeader;
