import { Box, Tab, Tabs, Typography } from "@mui/material";

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
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 pt-4 flex-col gap-4">
      <div className="px-8 flex flex-col justify-between">
        <p className="text-2xl font-semibold tracking-tight leading-8">
          Templates
        </p>
        <Typography
          className="font-medium tracking-tight"
          color="text.secondary"
        >
          Manage your templates
        </Typography>
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
