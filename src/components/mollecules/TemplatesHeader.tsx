import { Box, Tab, Tabs } from "@mui/material";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface ITemplatesHeaderProps {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
}

function TemplatesHeader({ value, handleChange }: ITemplatesHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container px-8 mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">Templates</h1>
      </div>
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 4 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="My Templates" {...a11yProps(0)} />
          <Tab label="Available Templates" {...a11yProps(1)} />
        </Tabs>
      </Box>
    </div>
  );
}

export default TemplatesHeader;
