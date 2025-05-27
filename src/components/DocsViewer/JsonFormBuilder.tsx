import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit3,
  Save,
  Code,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { FormField, JsonFormData } from "../../types/doc";

interface JsonFormBuilderProps {
  formData: JsonFormData;
  onFormUpdate: (data: JsonFormData) => void;
  placeholderNames: string[];
}

const JsonFormBuilder: React.FC<JsonFormBuilderProps> = ({
  formData,
  onFormUpdate,
  placeholderNames,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState(JSON.stringify(formData, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const addNewField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: "text",
      label: "New Field",
      placeholder: "Enter value",
      required: false,
    };

    onFormUpdate({
      ...formData,
      fields: [...formData.fields, newField],
    });
  };

  const removeField = (id: string) => {
    onFormUpdate({
      ...formData,
      fields: formData.fields.filter((field) => field.id !== id),
    });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onFormUpdate({
      ...formData,
      fields: formData.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    });
  };

  const moveField = (id: string, direction: "up" | "down") => {
    const index = formData.fields.findIndex((field) => field.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === formData.fields.length - 1)
    ) {
      return;
    }

    const newFields = [...formData.fields];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    [newFields[index], newFields[newIndex]] = [
      newFields[newIndex],
      newFields[index],
    ];

    onFormUpdate({
      ...formData,
      fields: newFields,
    });
  };

  const saveJsonChanges = () => {
    try {
      const parsed = JSON.parse(jsonText);

      // Validate basic structure
      if (!parsed.title || !Array.isArray(parsed.fields)) {
        throw new Error("JSON must have 'title' and 'fields' array");
      }

      // Validate fields
      parsed.fields.forEach((field: any, index: number) => {
        if (!field.id || !field.type || !field.label) {
          throw new Error(
            `Field at index ${index} missing required properties (id, type, label)`
          );
        }
      });

      onFormUpdate(parsed);
      setIsEditing(false);
      setJsonError(null);
    } catch (error) {
      setJsonError(
        error instanceof Error ? error.message : "Invalid JSON format"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-apple overflow-hidden"
    >
      <div className="border-b border-neutral-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Edit3 className="h-5 w-5 text-primary-500" />
          <h2 className="font-medium text-neutral-800">Form Builder</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm px-3 py-1.5 rounded flex items-center gap-1.5 border border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            <Code className="h-4 w-4" />
            {isEditing ? "Visual Mode" : "JSON Mode"}
          </button>

          {isEditing && (
            <button
              onClick={saveJsonChanges}
              className="text-sm px-3 py-1.5 rounded flex items-center gap-1.5 bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              Apply
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="p-4">
          <div className="h-[400px] border border-neutral-200 rounded-lg overflow-hidden">
            <Editor
              height="100%"
              language="json"
              value={jsonText}
              onChange={(value) => setJsonText(value || "")}
              options={{
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
          {jsonError && (
            <div className="mt-3 p-3 text-sm bg-error-500/10 border border-error-500/20 rounded text-error-500">
              {jsonError}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Form Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                onFormUpdate({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-neutral-800">Form Fields</h3>
              <button
                onClick={addNewField}
                className="text-sm px-3 py-1.5 rounded flex items-center gap-1.5 bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Field
              </button>
            </div>

            {formData.fields.length === 0 ? (
              <div className="text-center py-6 text-neutral-500 bg-neutral-50 rounded-lg">
                No fields added yet.
                <p className="mt-2 text-sm">
                  Add fields to collect data for your document placeholders.
                </p>
              </div>
            ) : (
              <ul className="space-y-4 max-h-[500px] overflow-y-auto">
                {formData.fields.map((field) => (
                  <li
                    key={field.id}
                    className="p-4 border border-neutral-200 rounded-lg hover:border-primary-200 transition-colors bg-neutral-50"
                  >
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{field.label}</div>
                        <div className="text-sm text-neutral-500">
                          ({field.type})
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveField(field.id, "up")}
                          className="p-1 text-neutral-400 hover:text-primary-500"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveField(field.id, "down")}
                          className="p-1 text-neutral-400 hover:text-primary-500"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeField(field.id)}
                          className="p-1 text-neutral-400 hover:text-error-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">
                          Field Label
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) =>
                            updateField(field.id, { label: e.target.value })
                          }
                          className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">
                          Field Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) =>
                            updateField(field.id, {
                              type: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="select">Select</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="date">Date</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">
                          Placeholder Text
                        </label>
                        <input
                          type="text"
                          value={field.placeholder || ""}
                          onChange={(e) =>
                            updateField(field.id, {
                              placeholder: e.target.value,
                            })
                          }
                          className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`required-${field.id}`}
                          checked={field.required || false}
                          onChange={(e) =>
                            updateField(field.id, {
                              required: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-primary-500 focus:ring-primary-500 rounded"
                        />
                        <label
                          htmlFor={`required-${field.id}`}
                          className="ml-2 text-sm text-neutral-700"
                        >
                          Required Field
                        </label>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs text-neutral-500 mb-1">
                          Map to Placeholder
                        </label>
                        <select
                          value={field.id}
                          onChange={(e) => {
                            // This would update the field ID to match a placeholder name
                            // In a real implementation, we would likely have a separate mapping
                            const newId = e.target.value;
                            updateField(field.id, { id: newId });
                          }}
                          className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                        >
                          {placeholderNames.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default JsonFormBuilder;
