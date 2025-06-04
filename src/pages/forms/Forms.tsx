import { useContext, useState } from "react";
import { Link } from "react-router";
import { Typography } from "@mui/material";

import FileItem from "../../components/atoms/FileItem";
import TabPanel from "../../components/atoms/TabPanel";
import FormsHeader from "../../components/mollecules/FormsHeader";
import FormsContext from "../../contexts/formsContext";
import { FormConfig } from "../../types/form";

function Forms() {
  const { forms } = useContext(FormsContext);

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderForms = (templatesList: FormConfig[]) => {
    return templatesList.map((template: FormConfig) => (
      <Link
        to={template.id}
        key={template.id}
        className="flex flex-col relative w-full sm:w-40 h-40"
      >
        <FileItem label={template.name} />
      </Link>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FormsHeader value={tabValue} handleChange={handleTabChange} />
      <div className="flex flex-col gap-6">
        {forms.length > 0 && (
          <div className="mx-8">
            <Typography variant="button">{"Recent Forms"}</Typography>
            {renderForms(forms)}
          </div>
        )}
        <div className="mx-8">
          <Typography variant="button">{"All Forms"}</Typography>
          <TabPanel value={tabValue} index={0}>
            {renderForms(forms)}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderForms(forms)}
          </TabPanel>
        </div>
      </div>
    </div>
  );
}

export default Forms;
