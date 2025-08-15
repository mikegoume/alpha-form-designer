import { FormConfig, FormInputElementType, FormValues } from "../types/form";

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve(reader.result as string | PromiseLike<string>);
    reader.onerror = (error) => reject(error);
  });
}

export function prepareDataToGenerateDocument(
  format: string,
  formConfig: FormConfig,
  formValues: FormValues,
  locked: boolean,
) {
  return {
    templateId: formConfig.templateId as number,
    templateVersion: formConfig.version,
    // issueDate: formConfig.creationTs,
    templateType: "DOCX",
    fileProperties: {
      fileName: formConfig.name,
      fileFormat: format,
      fileMetadata: {
        title: formConfig.name,
        author: "DocGen Author",
        subject: "DocGen Subject",
        keywords: "DocGen Keywords",
        creator: "DocGen Creator",
      },
    },
    metadata: {
      masterMetadata: {
        resolution: "HIGH",
        langId: "el-GR",
        restrictEditing: locked,
        restrictionPassword: "123456",
      },
      templateMetadata: [
        ...(formConfig as FormConfig).formVariables
          .filter(
            (v): v is FormInputElementType =>
              "templateId" in v &&
              Boolean(v.name) &&
              Boolean(v.type) &&
              formValues[v.id] !== undefined,
          )
          .map((v) =>
            v.type === "IMAGE"
              ? {
                  name: v.name.split(".base64")[0],
                  type: "IMAGE",
                  base64: formValues[v.id],
                }
              : v.type === "TABLE"
                ? {
                    name: v.name,
                    type: "TABLE",
                    header: "Employees table header text",
                    footer: "Employees table footer text",
                    columns: v.columns?.map((col) => ({
                      name: col.name,
                      value: col.name,
                    })),
                    items: formValues[v.id].map((item) => ({
                      item: v.columns.map((itemColumn) => ({
                        name: itemColumn.name,
                        type: "TEXT", //itemcolumn.type
                        value: item[itemColumn.name],
                      })),
                    })),
                  }
                : {
                    name: v.name,
                    type: v.name === "amount" ? "NUMBER" : "TEXT",
                    value: formValues[v.id],
                  },
          ),
      ],
    },
  };
}
