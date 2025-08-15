import { v4 as uuidv4 } from "uuid";

import { RowData } from "../components/FormBuilder/FormRenderer";
import { ButtonElement, ButtonType, Column, FieldTypes } from "../types/form";
import { Placeholder } from "../types/templates";

// Create a base input element
export const createInputElement = (
  placeholder: Placeholder,
  position: number,
) => {
  const { name } = placeholder;

  return {
    ...placeholder,
    defaultValue: null,
    label: name,
    mask: null,
    position,
    requestParameters: [],
  };
};

// Create a base button element
export const createButtonElement = (actionType: ButtonType): ButtonElement => ({
  id: uuidv4(),
  type: "button",
  label: actionType.charAt(0).toUpperCase() + actionType.slice(1),
  actionType,
  position: 0,
  serviceParams: [],
  responseMapping: [],
});

export const createFormPreviewTableRow = (columns: Column[]): RowData => {
  const row: RowData = { rowId: uuidv4() };

  columns.forEach((col) => {
    if (col.type === FieldTypes.BOOLEAN) row[col.name] = false;
    else if (col.type === FieldTypes.DATETIME) row[col.name] = null;
    else row[col.name] = "";
  });

  return row;
};

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1]; // remove data:image/...;base64,
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Utility: Convert camelCase to Title Case
function toTitleCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (c) => c.toUpperCase()) // Capitalize first character
    .trim();
}

// Main function: transform fields array
export const transformTemplateFields: (
  fields: Placeholder[],
) => Placeholder[] = (fields) => {
  const tableMap = new Map(); // tableName => { baseItem, columns: Map<colName, type> }

  const filteredFields = [];

  for (const field of fields) {
    const { name, type } = field;

    if (name.includes(".")) {
      const [tableName, columnName] = name.split(".");

      // 🛑 Exclude *.base64 fields from grouping
      if (columnName === "base64") {
        filteredFields.push(field);
        continue;
      }

      if (!tableMap.has(tableName)) {
        tableMap.set(tableName, {
          baseItem: { ...field },
          columns: new Map(),
        });
      }

      tableMap.get(tableName).columns.set(columnName, type);
    } else {
      filteredFields.push(field);
    }
  }

  const tableEntries = Array.from(tableMap.entries()).map(
    ([tableName, { baseItem, columns }]) => ({
      ...baseItem,
      name: tableName,
      type: "TABLE", // force table type
      columns: Array.from(columns.entries()).map(([colName, colType]) => ({
        name: colName,
        value: toTitleCase(colName),
        type: colType, // ✅ assign original column type
      })),
    }),
  );

  return [...filteredFields, ...tableEntries];
};
