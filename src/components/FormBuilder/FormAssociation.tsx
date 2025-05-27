import { useState } from "react";

function FormAssociation() {
  const [templateId, setTemplateId] = useState<string>("none");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-medium text-gray-700">Form Association</h2>
      </div>

      {/* Input Elements Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Templates</h3>
        <select
          value={templateId}
          defaultValue={"none"}
          onChange={(e) => setTemplateId(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
        ></select>
      </div>
    </div>
  );
}

export default FormAssociation;
