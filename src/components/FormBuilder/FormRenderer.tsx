import React, { useState } from "react";
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
import dayjs, { Dayjs } from "dayjs";

import { FieldTypes } from "../../types/form";
import ImageUpload from "../atoms/ImageUpload";

interface FormRendererProps {
  element: any;
  value?: any;
  onChange?: (value: any) => void;
  onButtonClick?: () => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  element,
  value,
  onChange,
  onButtonClick,
}) => {
  // Render input elements
  const { id, type, label, serviceIdToLoad, columns } = element;

  // const getDefaultRow = () => {
  //   const row = { id: uuidv4() };
  //   (columns ?? []).forEach((col) => {
  //     if (col.type === FieldTypes.BOOLEAN) row[col.name] = false;
  //     else if (col.type === "date") row[col.name] = null;
  //     else row[col.name] = "";
  //   });
  //   return row;
  // };

  const [rows, setRows] = useState([]);

  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev]);
  };

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
            value={""}
            fullWidth
          >
            {[]?.map((endpoint: any) => (
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
      );
    case FieldTypes.IMAGE:
      return <ImageUpload onImageSelect={() => {}} />;
    case FieldTypes.TABLE:
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.name}>{col.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => {
                    const value = row[col.name];

                    return (
                      <TableCell key={col.name}>
                        {col.type === "text" || col.type === "number" ? (
                          <TextField
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
        <Button variant="contained" size="large">
          {label}
        </Button>
      );
    default:
      return null;
  }
};

export default FormRenderer;
