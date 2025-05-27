import React from "react";
import { motion } from "framer-motion";
import { AlarmCheck as FormCheck } from "lucide-react";
import { JsonFormData } from "../../types/doc";

interface FormRendererProps {
  formData: JsonFormData;
  formValues: Record<string, string>;
  onFormValueChange: (fieldId: string, value: string) => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  formData,
  formValues,
  onFormValueChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-lg shadow-apple overflow-hidden"
    >
      <div className="border-b border-neutral-200 p-4">
        <h2 className="font-medium text-neutral-800 flex items-center gap-2">
          <FormCheck className="h-5 w-5 text-primary-500" />
          {formData.title || "Form Preview"}
        </h2>
      </div>

      <div className="p-4">
        {formData.fields.length === 0 ? (
          <div className="text-center py-6 text-neutral-500 bg-neutral-50 rounded-lg">
            No form fields available.
            <p className="mt-2 text-sm">
              Add fields in the Form Builder to collect data.
            </p>
          </div>
        ) : (
          <form className="space-y-4">
            {formData.fields.map((field) => (
              <div key={field.id} className="animate-fade-in">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-error-500">*</span>
                  )}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    value={formValues[field.id] || ""}
                    onChange={(e) =>
                      onFormValueChange(field.id, e.target.value)
                    }
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}

                {field.type === "number" && (
                  <input
                    type="number"
                    value={formValues[field.id] || ""}
                    onChange={(e) =>
                      onFormValueChange(field.id, e.target.value)
                    }
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}

                {field.type === "select" && (
                  <select
                    value={formValues[field.id] || ""}
                    onChange={(e) =>
                      onFormValueChange(field.id, e.target.value)
                    }
                    required={field.required}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`checkbox-${field.id}`}
                      checked={formValues[field.id] === "true"}
                      onChange={(e) =>
                        onFormValueChange(
                          field.id,
                          e.target.checked ? "true" : "false"
                        )
                      }
                      required={field.required}
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 rounded"
                    />
                    <label
                      htmlFor={`checkbox-${field.id}`}
                      className="ml-2 text-sm text-neutral-700"
                    >
                      {field.placeholder || field.label}
                    </label>
                  </div>
                )}

                {field.type === "date" && (
                  <input
                    type="date"
                    value={formValues[field.id] || ""}
                    onChange={(e) =>
                      onFormValueChange(field.id, e.target.value)
                    }
                    required={field.required}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default FormRenderer;
