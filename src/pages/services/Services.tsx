import { useState } from "react";
import { Divider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { fetchEndpoints } from "../../api/endpoints";
import FileItem from "../../components/atoms/FileItem";
import FilterComponent from "../../components/molecules/LayoutFilters";
import ServicesHeader from "../../components/molecules/ServicesHeader";
import { Endpoint } from "../../types/endpoints";

function Services() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );

  const {
    data: templatesData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchEndpoints,
  });

  const templates = templatesData?.data;

  if (!templates || !templatesData.data || isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const selectedTemplate = templates?.find(
    (template) => template.id === selectedTemplateId,
  );

  const handleTemplateClick = (template: Endpoint) => {
    setSelectedTemplateId(template.id);
  };

  const handleCloseSidebar = () => {
    setSelectedTemplateId(null);
  };

  const renderTemplates = (templatesList: Endpoint[]) => {
    return templatesList?.map((template: Endpoint) => (
      <button
        onClick={() => handleTemplateClick(template)}
        key={template.id}
        className="flex flex-col relative w-full sm:w-40 h-40"
      >
        <FileItem label={template.name} />
      </button>
    ));
  };

  return (
    <div className="flex h-full relative">
      <div className="flex flex-1 flex-col">
        <ServicesHeader />
        <div className="flex flex-1 flex-col gap-8 bg-gray-50 p-8 overflow-auto">
          <FilterComponent />
          <div className="flex flex-col overflow-y-auto">
            <div className="grid grid-cols-10 gap-2">
              {renderTemplates(templates)}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <AnimatePresence>
        {selectedTemplateId && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-30 z-[100]"
              onClick={handleCloseSidebar}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3,
              }}
              className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-[500] flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Service Details
                </h2>
                <button
                  onClick={handleCloseSidebar}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {selectedTemplate && (
                  <div className="space-y-4">
                    {Object.entries(selectedTemplate).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between items-start text-sm text-gray-700 gap-4">
                          <span className="font-medium capitalize w-1/2">
                            {key}
                          </span>
                          <span className="text-gray-600 w-1/2 break-words text-right">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : value?.toString()}
                          </span>
                        </div>
                        <Divider className="mt-2" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Services;
