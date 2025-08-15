import axios, { isAxiosError } from "axios";

import { Endpoint } from "../types/endpoints";

export const fetchEndpoints = async (): Promise<
  fetchTemplatesApiResponse | undefined
> => {
  try {
    const response = await axios.get("/api2/api/v1/endpoints");

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Axios error posting data:", error.message);
      // You can also access error.response?.data, etc.
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
  }
};

export const fetchObjectDataEndpoint = async (
  endpointId: number,
  data: any,
) => {
  try {
    const response = await axios.post(
      "/api2/api/v1/fetchObjectData/" + endpointId,
      data,
    );

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Axios error posting data:", error.message);
      // You can also access error.response?.data, etc.
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
  }
};

export const fetchArrayDataEndpoint = async (endpointId: number, data: any) => {
  try {
    const response = await axios.post(
      "/api2/api/v1/fetchArrayData/" + endpointId,
      data,
    );

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Axios error posting data:", error.message);
      // You can also access error.response?.data, etc.
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
  }
};

export const generateDocument = async (data: DocumentTemplate) => {
  try {
    const response = await axios.post("/api2/api/v1/docgen", data, {
      responseType: "blob",
      headers: {
        Accept:
          data.fileProperties.fileFormat === "PDF"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Axios error posting data:", error.message);
      // You can also access error.response?.data, etc.
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
  }
};

export type fetchTemplatesApiResponse = {
  message: string;
  errorCode: string;
  errorDetails: string[];
  timestamp: string;
  runtime: number;
  resultSize: number;
  data: Endpoint[];
};

type FileMetadata = {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
};

type FileProperties = {
  fileName: string;
  fileFormat: string;
  fileMetadata: FileMetadata;
};

type MasterMetadata = {
  resolution: string; // e.g., "HIGH"
  langId: string; // e.g., "el-GR"
  restrictEditing: boolean;
  restrictionPassword: string;
};

type TemplateField = {
  name: string;
  type: "TEXT" | "LIST" | "NUMBER" | string; // Extendable
  value?: string | number;
  base64?: string;
};

type Metadata = {
  masterMetadata: MasterMetadata;
  templateMetadata: TemplateField[];
};

export type DocumentTemplate = {
  templateId: number;
  templateVersion: string;
  templateType: string; // e.g., "DOCX"
  fileProperties: FileProperties;
  metadata: Metadata;
};
