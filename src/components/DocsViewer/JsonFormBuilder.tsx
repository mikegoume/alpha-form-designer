import React from "react";
import { FormConfig } from "../../types/form";
import FormPreview from "../FormBuilder/FormPreview";

interface JsonFormBuilderProps {
  formConfig: FormConfig;
}

const JsonFormBuilder: React.FC<JsonFormBuilderProps> = ({ formConfig }) => {
  return (
    <div className="lg:col-span-5">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-medium text-gray-700">Form Preview</h2>
        </div>
        <FormPreview
          config={formConfig}
          formValues={{}}
          onValueChange={() => {}}
          onSelectElement={() => {}}
          selectedElementId={null}
          onReorderElements={() => {}}
          isEditable={false}
          onRemoveElement={() => {}}
        />
      </div>
    </div>
  );
};

export default JsonFormBuilder;
