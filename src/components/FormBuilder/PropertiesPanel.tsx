import React, { useState, useEffect } from "react";
import { InputElement, ButtonElement, APIConfig } from "../../types/form";
import { Trash2 } from "lucide-react";

interface PropertiesPanelProps {
  element: InputElement | ButtonElement | undefined;
  onUpdateElement: (element: InputElement | ButtonElement) => void;
  onRemoveElement: (id: string) => void;
  formElements: (InputElement | ButtonElement)[];
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  element,
  onUpdateElement,
  onRemoveElement,
  formElements,
}) => {
  // Early return if element is undefined to prevent any operations on undefined
  if (!element) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center text-gray-500">
        <p>Select an element to edit its properties</p>
      </div>
    );
  }

  const [apiConfig, setApiConfig] = useState<APIConfig | undefined>(
    "actionType" in element && element.actionType === "api"
      ? element.apiConfig
      : undefined
  );

  // Update API config when element changes
  useEffect(() => {
    if ("actionType" in element && element.actionType === "api") {
      setApiConfig(element.apiConfig);
    } else {
      setApiConfig(undefined);
    }
  }, [element]);

  // Get available form input keys for API response mapping
  const availableInputKeys = formElements
    .filter((el): el is InputElement => "key" in el)
    .map((el) => ({ key: el.key, label: el.label }));

  // Handle text input change
  const handleTextChange = (key: string, value: string) => {
    onUpdateElement({ ...element, [key]: value });
  };

  // Handle checkbox input change
  const handleCheckboxChange = (key: string, checked: boolean) => {
    onUpdateElement({ ...element, [key]: checked });
  };

  // Handle API config change
  const handleApiConfigChange = (key: string, value: string) => {
    if (!("actionType" in element) || element.actionType !== "api") return;

    const updatedConfig = { ...(apiConfig || {}), [key]: value };
    setApiConfig(updatedConfig);

    onUpdateElement({
      ...element,
      apiConfig: updatedConfig,
    });
  };

  // Handle response mapping change
  const handleResponseMappingChange = (
    responseKey: string,
    formKey: string
  ) => {
    if (
      !("actionType" in element) ||
      element.actionType !== "api" ||
      !apiConfig
    )
      return;

    const updatedMapping = { ...(apiConfig.responseMapping || {}) };

    if (formKey) {
      updatedMapping[responseKey] = formKey;
    } else {
      delete updatedMapping[responseKey];
    }

    const updatedConfig = { ...apiConfig, responseMapping: updatedMapping };
    setApiConfig(updatedConfig);

    onUpdateElement({
      ...element,
      apiConfig: updatedConfig,
    });
  };

  // Handle adding a new response mapping
  const handleAddResponseMapping = () => {
    if (
      !("actionType" in element) ||
      element.actionType !== "api" ||
      !apiConfig
    )
      return;

    // Find an input key that's not already mapped
    const availableInput = availableInputKeys.find(
      (input) =>
        !Object.values(apiConfig.responseMapping || {}).includes(input.key)
    );

    if (!availableInput) return;

    const updatedMapping = {
      ...(apiConfig.responseMapping || {}),
      [`responseKey_${Object.keys(apiConfig.responseMapping || {}).length}`]:
        availableInput.key,
    };

    const updatedConfig = { ...apiConfig, responseMapping: updatedMapping };
    setApiConfig(updatedConfig);

    onUpdateElement({
      ...element,
      apiConfig: updatedConfig,
    });
  };

  // Handle options changes for select, radio, etc.
  const handleOptionsChange = (
    options: Array<{ label: string; value: string }>
  ) => {
    if (!("options" in element)) return;

    onUpdateElement({
      ...element,
      options,
    });
  };

  // Add a new option for select, radio, etc.
  const handleAddOption = () => {
    if (!("options" in element)) return;

    const options = [...(element.options || [])];
    options.push({
      label: `Option ${options.length + 1}`,
      value: `option${options.length + 1}`,
    });

    onUpdateElement({
      ...element,
      options,
    });
  };

  // Update an option
  const handleUpdateOption = (
    index: number,
    key: "label" | "value",
    value: string
  ) => {
    if (!("options" in element) || !element.options) return;

    const options = [...element.options];
    options[index] = { ...options[index], [key]: value };

    onUpdateElement({
      ...element,
      options,
    });
  };

  // Remove an option
  const handleRemoveOption = (index: number) => {
    if (!("options" in element) || !element.options) return;

    const options = [...element.options];
    options.splice(index, 1);

    onUpdateElement({
      ...element,
      options,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="font-medium text-gray-700">
          Properties:{" "}
          {"type" in element && element.type !== "button"
            ? element.type.charAt(0).toUpperCase() + element.type.slice(1)
            : "Button"}
        </h2>
        <button
          onClick={() => onRemoveElement(element.id)}
          className="p-1 text-gray-400 hover:text-red-500 rounded"
          title="Delete element"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
        {/* Common properties for all elements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={"label" in element ? element.label : ""}
            onChange={(e) => handleTextChange("label", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Input-specific properties */}
        {"key" in element && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Key (used for data binding)
              </label>
              <input
                type="text"
                value={element.key}
                onChange={(e) => handleTextChange("key", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {element.type !== "checkbox" && element.type !== "radio" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={element.placeholder || ""}
                  onChange={(e) =>
                    handleTextChange("placeholder", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={element.required || false}
                onChange={(e) =>
                  handleCheckboxChange("required", e.target.checked)
                }
                className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
              />
              <label
                htmlFor="required"
                className="ml-2 block text-sm text-gray-700"
              >
                Required
              </label>
            </div>

            {/* Options for select, radio, checkbox */}
            {(element.type === "select" || element.type === "radio") && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="px-2 py-1 text-xs bg-blue-50 text-blue-500 rounded hover:bg-blue-100"
                  >
                    Add Option
                  </button>
                </div>

                {element.options &&
                  element.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-2 space-x-2"
                    >
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) =>
                          handleUpdateOption(index, "label", e.target.value)
                        }
                        placeholder="Label"
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) =>
                          handleUpdateOption(index, "value", e.target.value)
                        }
                        placeholder="Value"
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        {/* Button-specific properties */}
        {"actionType" in element && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Variant
              </label>
              <select
                value={element.variant || "primary"}
                onChange={(e) => handleTextChange("variant", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Size
              </label>
              <select
                value={element.size || "md"}
                onChange={(e) => handleTextChange("size", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>

            {/* API-specific configuration */}
            {element.actionType === "api" && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  API Configuration
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API URL
                    </label>
                    <input
                      type="text"
                      value={apiConfig?.url || ""}
                      onChange={(e) =>
                        handleApiConfigChange("url", e.target.value)
                      }
                      placeholder="https://api.example.com/data"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Method
                    </label>
                    <select
                      value={apiConfig?.method || "GET"}
                      onChange={(e) =>
                        handleApiConfigChange("method", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Response Mapping
                      </label>
                      <button
                        type="button"
                        onClick={handleAddResponseMapping}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-500 rounded hover:bg-blue-100"
                        disabled={availableInputKeys.length === 0}
                      >
                        Add Mapping
                      </button>
                    </div>

                    {apiConfig?.responseMapping &&
                    Object.entries(apiConfig.responseMapping).length > 0 ? (
                      Object.entries(apiConfig.responseMapping).map(
                        ([responseKey, formKey]) => (
                          <div
                            key={responseKey}
                            className="flex items-center mb-2 space-x-2"
                          >
                            <input
                              type="text"
                              value={responseKey}
                              onChange={(e) => {
                                const oldValue = responseKey;
                                const newValue = e.target.value;
                                const updatedMapping = {
                                  ...(apiConfig.responseMapping || {}),
                                };
                                delete updatedMapping[oldValue];
                                updatedMapping[newValue] = formKey;
                                const updatedConfig = {
                                  ...apiConfig,
                                  responseMapping: updatedMapping,
                                };
                                setApiConfig(updatedConfig);
                                onUpdateElement({
                                  ...element,
                                  apiConfig: updatedConfig,
                                });
                              }}
                              placeholder="API Response Key"
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <select
                              value={formKey}
                              onChange={(e) =>
                                handleResponseMappingChange(
                                  responseKey,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="">-- Select Form Field --</option>
                              {availableInputKeys.map((input) => (
                                <option key={input.key} value={input.key}>
                                  {input.label} ({input.key})
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                handleResponseMappingChange(responseKey, "")
                              }
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No mappings configured. Add mappings to auto-fill form
                        fields from API responses.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
