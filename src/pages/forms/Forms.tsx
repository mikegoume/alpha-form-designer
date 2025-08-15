import { useState } from "react";
import { Link, To } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { fetchForms } from "../../api/forms";
import FileItem from "../../components/atoms/FileItem";
import FormsHeader from "../../components/molecules/FormsHeader";
import { Form } from "../../types/form";

function Forms() {
  const { data: formsData, isLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: fetchForms,
  });

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderForms = (formsList: Form[]) => {
    return formsList.map((template: Form) => (
      <Link
        to={String(template.id) as To}
        key={template.id}
        className="flex flex-col relative w-full sm:w-40 h-40"
      >
        <FileItem label={template.name} isForm={true} />
      </Link>
    ));
  };

  const forms = formsData?.data;

  if (!forms || isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <FormsHeader value={tabValue} handleChange={handleTabChange} />
      <div className="flex flex-1 flex-col gap-8 bg-gray-50 p-8 overflow-auto">
        {/* <HeaderFilters /> */}
        <div className="flex flex-col overflow-y-auto">
          <div className="grid grid-cols-10 gap-2">
            {/* <TabPanel value={tabValue} index={0}> */}
            {renderForms(forms)}
            {/* </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {renderForms(forms)}
            </TabPanel> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Forms;
