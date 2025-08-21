import React, { memo, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useMutation } from "@tanstack/react-query";

import { fetchArrayDataEndpoint } from "../../api/endpoints";
import { Column, FieldTypes, FormConfig, FormValues } from "../../types/form";
import { mapRequestParamsToValues } from "../../utils/endpoints";
import ImageUpload from "../atoms/ImageUpload";
interface FormRendererProps {
  formConfig: FormConfig;
  formValues: FormValues;
  element: any;
  value?: any;
  onChange?: (value: any) => void;
  onButtonClick?: () => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  formConfig,
  formValues,
  element,
  value,
  onChange,
  onButtonClick,
}) => {
  // Render input elements
  const { type, label, serviceIdToLoad, columns, requestParameters } = element;

  const [availableOptions, setAvailableOptions] = useState<any[]>([]);

  const fetchArrayDataMutation = useMutation({
    mutationKey: ["fetch-array-data"],
    mutationFn: ({ endpointId, data }: { endpointId: number; data: any }) =>
      fetchArrayDataEndpoint(endpointId, data),
    onSuccess: (res) =>
      setAvailableOptions(
        res.data.map((val: string) => ({ label: val, value: val })),
      ),
  });

  useEffect(() => {
    if (!serviceIdToLoad || type !== FieldTypes.LIST) return;

    fetchArrayDataMutation.mutate({
      endpointId: serviceIdToLoad,
      data: mapRequestParamsToValues(requestParameters, formConfig, formValues),
    });
  }, [serviceIdToLoad, formValues]);

  const getDefaultRow = () => {
    let row: any = {};

    columns?.map((col: Column) => (row = { ...row, [col.name]: "" }));

    return row;
  };

  const [rows, setRows] = useState([]);

  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
    onChange && onChange(rows);
  };

  const addRow = () => {
    setRows((prev) => [...prev, getDefaultRow()]);
  };

  // console.log(label, value);

  switch (type) {
    case FieldTypes.TEXT:
    case FieldTypes.NUMBER:
    case FieldTypes.DOUBLE:
      return (
        <TextField
          fullWidth
          placeholder={label}
          value={value || ""}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      );
    case FieldTypes.LIST:
      return (
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select
            label={label}
            id="demo-simple-select-label"
            value={value ?? ""}
            fullWidth
            onChange={(e) => onChange && onChange(e.target.value)}
          >
            {availableOptions?.map((option: any) => (
              <MenuItem key={option.label} value={option.value}>
                <p className="text-16">{option.label}</p>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    case FieldTypes.IMAGE:
      return <ImageUpload onImageSelect={onChange as (value: any) => void} />;
    case FieldTypes.TABLE:
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.name}>{col.value}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => {
                    const value = row[col.name];

                    return (
                      <TableCell key={col.name}>
                        {col.type === FieldTypes.TEXT ||
                        col.type === FieldTypes.NUMBER ? (
                          <TextField
                            label={col.value}
                            type={col.type}
                            value={value as string | number}
                            onChange={(e) =>
                              handleChange(
                                row.id,
                                col.name,
                                col.type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value,
                              )
                            }
                            fullWidth
                          />
                        ) : col.type === "boolean" ? (
                          <Checkbox
                            checked={value as boolean}
                            onChange={(e) =>
                              handleChange(row.id, col.name, e.target.checked)
                            }
                          />
                        ) : col.type === "date" ? (
                          <DatePicker
                            value={value ? dayjs(value as Dayjs) : null}
                            onChange={(newValue) =>
                              handleChange(row.id, col.name, newValue)
                            }
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={addRow} variant="contained" sx={{ mt: 2 }}>
            Add Row
          </Button>
        </LocalizationProvider>
      );
    case "button":
      return (
        <Button variant="contained" size="large" onClick={onButtonClick}>
          {label}
        </Button>
      );
    default:
      return null;
  }
};

export default memo(FormRenderer);
