import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";

import { fetchEndpoints } from "../../api/endpoints";
import { inputTypes } from "../../pages/forms/constants";
import { Endpoint } from "../../types/endpoints";
import {
  FieldTypeOption,
  FieldTypes,
  FormInputElementType,
  FormVariable,
} from "../../types/form";

interface PropertiesPanelProps {
  element: FormVariable;
  onUpdateElement: (updatedElement: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  element,
  onUpdateElement,
}) => {
  const [properties, setProperties] = useState<FormInputElementType>({
    label: "",
    type: FieldTypes.TEXT,
    required: false,
  });

  const { data: endpointsData } = useQuery({
    queryKey: ["services"],
    queryFn: fetchEndpoints,
  });

  const endpoints = endpointsData?.data;

  useEffect(() => {
    if (element) {
      setProperties({ ...element });
    }
  }, [element]);

  const updateProperty = (key: keyof FormInputElementType, value: any) => {
    setProperties((prev) => ({ ...prev, [key]: value }));
  };
  const addColumn = () => {
    const currentColumns = properties.columns || [];
    updateProperty("columns", [...currentColumns, { name: "", type: "text" }]);
  };
  const updateColumn = (
    index: number,
    field: "name" | "type",
    value: string,
  ) => {
    const currentColumns = properties.columns || [];
    const newColumns = [...currentColumns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    updateProperty("columns", newColumns);
  };
  const removeColumn = (index: number) => {
    const currentColumns = properties.columns || [];
    const newColumns = currentColumns.filter((_, i) => i !== index);
    updateProperty("columns", newColumns);
  };

  const selectedEndpoint = useMemo(() => {
    return endpoints?.find(
      (endpoint) => endpoint.id === properties.serviceIdToLoad,
    );
  }, [endpoints, properties.serviceIdToLoad]);

  const renderTypeSpecificProperties = () => {
    switch (properties.type) {
      case FieldTypes.TEXT:
        return (
          <div className="space-y-4">
            <TextField
              label="Max Length"
              variant="outlined"
              fullWidth
              id="maxLength"
              type="number"
              value={properties.maxLength ?? ""}
              onChange={(e) =>
                updateProperty(
                  "maxLength",
                  Number.parseInt(e.target.value) || undefined,
                )
              }
              placeholder="Maximum character length"
            />
          </div>
        );
      case FieldTypes.NUMBER:
      case FieldTypes.DOUBLE:
        return (
          <div className="space-y-4">
            <Grid container spacing={2}>
              <TextField
                label="Min Value"
                variant="outlined"
                fullWidth
                id="minValue"
                type="number"
                value={properties.minValue ?? ""}
                onChange={(e) =>
                  updateProperty(
                    "minValue",
                    Number.parseFloat(e.target.value) || undefined,
                  )
                }
                placeholder="Minimum value"
              />
              <TextField
                label="Max Value"
                variant="outlined"
                fullWidth
                id="maxValue"
                type="number"
                value={properties.maxValue ?? ""}
                onChange={(e) =>
                  updateProperty(
                    "maxValue",
                    Number.parseFloat(e.target.value) || undefined,
                  )
                }
                placeholder="Maximum value"
              />
            </Grid>
          </div>
        );
      case FieldTypes.BOOLEAN:
        return (
          <FormControlLabel
            control={
              <Switch
                id="defaultValue"
                checked={Boolean(properties.defaultValue)}
                onChange={(_, checked) =>
                  updateProperty("defaultValue", checked)
                }
              />
            }
            label="Default Value"
          />
        );
      case FieldTypes.LIST:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="subtitle1">Default Values</Typography>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Service</InputLabel>
              <Select
                label="Service"
                id="demo-simple-select-label"
                value={properties.serviceIdToLoad ?? ""}
                onChange={(e) => {
                  updateProperty("serviceIdToLoad", e.target.value);
                }}
                fullWidth
              >
                {endpoints?.map((endpoint: Endpoint) => (
                  <MenuItem key={endpoint.id} value={endpoint.id}>
                    <div className="flex flex-col">
                      <p className="text-16">{endpoint.name}</p>
                      <p className="text-10 text-gray-400">
                        {endpoint.description}
                      </p>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedEndpoint?.requestParameters.map((requestParam) => (
              <div key={requestParam.id}>
                <p>{requestParam.name}</p>
                <div>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      label="Type"
                      id="demo-simple-select-label"
                      value={properties.defaultValue ?? ""}
                      onChange={(e) => {}}
                      fullWidth
                    >
                      <MenuItem value={"hardcoded"}>Hardcoded</MenuItem>
                      <MenuItem value={"input_key"}>Input Field</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      label="Type"
                      id="demo-simple-select-label"
                      value={properties.defaultValue ?? ""}
                      onChange={(e) => {}}
                      fullWidth
                    >
                      <MenuItem value={"hardcoded"}>Hardcoded</MenuItem>
                      <MenuItem value={"input_key"}>Input Field</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            ))}
          </Box>
        );
      case FieldTypes.TABLE:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">Columns</Typography>
              <Button
                type="button"
                variant="outlined"
                size="small"
                startIcon={<Plus />}
                onClick={addColumn}
              >
                Add Column
              </Button>
            </Box>
            <Stack spacing={1}>
              {(properties.columns || []).map((column, index) => (
                <Box key={index} display="flex" alignItems="center" gap={1}>
                  <TextField
                    value={column.name}
                    onChange={(e) =>
                      updateColumn(index, "name", e.target.value)
                    }
                    placeholder="Column name"
                    fullWidth
                  />
                  <Select
                    value={column.type}
                    onChange={(e) =>
                      updateColumn(index, "type", e.target.value)
                    }
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                  </Select>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeColumn(index)}
                  >
                    <Trash2 fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Box>
        );
      case FieldTypes.DATETIME:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Grid container spacing={2}>
              <TextField
                label="Min Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={properties.minDate || ""}
                onChange={(e) => updateProperty("minDate", e.target.value)}
              />
              <TextField
                label="Max Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={properties.maxDate || ""}
                onChange={(e) => updateProperty("maxDate", e.target.value)}
              />
            </Grid>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Date Format
              </Typography>
              <Select
                fullWidth
                displayEmpty
                value={properties.dateFormat || ""}
                onChange={(e) => updateProperty("dateFormat", e.target.value)}
              >
                <MenuItem value="" disabled>
                  Select date format
                </MenuItem>
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                <MenuItem value="MM-DD-YYYY">MM-DD-YYYY</MenuItem>
              </Select>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  // console.log(properties);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div>
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200">
          <p>Properties: {element.label}</p>
        </div>
        {/* Basic Properties */}
        <div className="flex flex-col gap-4 p-4">
          <TextField
            label="Label"
            fullWidth
            placeholder={element.label}
            value={element.label}
            onChange={(e) => onUpdateElement(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Field Type</InputLabel>
            <Select
              label="Field Type"
              id="demo-simple-select-label"
              value={properties.type}
              onChange={(e) => updateProperty("type", e.target.value)}
              fullWidth
            >
              {inputTypes.map((inputType: FieldTypeOption) => (
                <MenuItem key={inputType.type} value={inputType.type}>
                  {inputType.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel control={<Checkbox />} label="Required" />
        </div>
        <Divider orientation="horizontal" flexItem />
        <div className="flex flex-col gap-4 p-4">
          {properties.type !== FieldTypes.IMAGE && (
            <h3 className="text-sm font-medium">Type-specific Properties</h3>
          )}
          {renderTypeSpecificProperties()}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
