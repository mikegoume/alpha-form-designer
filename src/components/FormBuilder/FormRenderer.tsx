import React from "react";
import { Button, TextField } from "@mui/material";

import { FieldTypes } from "../../types/form";

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
  // Render a button element
  if ("actionType" in element) {
    const { label, variant = "primary", size = "md" } = element;

    return <Button onClick={onButtonClick}>{label}</Button>;
  }

  // Render input elements
  const { id, type, label, columns } = element;

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

    default:
      return null;
  }
};

export default FormRenderer;
