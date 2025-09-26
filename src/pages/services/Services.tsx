import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { CircularProgress, Divider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { fetchEndpoints } from "../../api/endpoints";
import FileItem from "../../components/atoms/FileItem";
import FilterComponent from "../../components/molecules/LayoutFilters";
import ServicesHeader from "../../components/molecules/ServicesHeader";
import { Endpoint } from "../../types/endpoints";

function Services() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );

  const {
    data: servicesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchEndpoints,
    retry: 5, // retry up to 5 times
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // exponential backoff (max 30s)
  });

  const services = servicesData?.data;

  useEffect(() => {
    if (serviceId) {
      setSelectedTemplateId(parseInt(serviceId, 10));
    } else {
      setSelectedTemplateId(null);
    }
  }, [serviceId]);

  const selectedTemplate = services?.find(
    (template) => template.id === selectedTemplateId,
  );

  const handleCloseSidebar = () => {
    navigate(-1);
  };

  const renderServices = (servicesList: Endpoint[]) => {
    return servicesList?.map((service: Endpoint) => (
      <Link
        to={`${service.id}`}
        key={service.id}
        className="flex flex-col items-center relative sm:size-40 hover:cursor-pointer"
      >
        <FileItem label={service.name} isService />
      </Link>
    ));
  };

  return (
    <div className="flex h-full relative">
      <div className="flex flex-1 flex-col">
        <ServicesHeader />
        <div className="flex flex-1 flex-col gap-8 bg-gray-50 p-8 overflow-auto">
          <FilterComponent />
          {isLoading && (
            <div className="flex flex-col flex-1 justify-center items-center">
              <CircularProgress />
            </div>
          )}

          {isError && (
            <div className="flex flex-col pt-20 justify-center items-center text-red-600">
              <p>Something went wrong! Failed to load forms.</p>
              <p className="text-sm text-gray-500">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          )}

          {!isLoading && !isError && services && (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] place-items-center">
              {renderServices(services)}
            </div>
          )}
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
                    {Object.entries(selectedTemplate).map(
                      ([key, value]) =>
                        (key === "name" ||
                          key === "description" ||
                          key === "url") && (
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
                        ),
                    )}
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
