import axios, { isAxiosError } from "axios";

import { Template } from "../types/templates";

export const fetchTemplates = async (): Promise<
  fetchTemplatesApiResponse | undefined
> => {
  try {
    const response = await axios.get(
      "https://dev-alphabank9.i-docs.local/backend/api/v1/templates",
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

export const fetchTemplate = async (
  id: string,
): Promise<fetchTemplateApiResponse | undefined> => {
  try {
    const response = await axios.get(
      "https://dev-alphabank9.i-docs.local/backend/api/v1/templates/" + id,
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

export const extractTemplatePlaceholder = async (id: string) => {
  try {
    const response = await axios.get(
      "https://dev-alphabank9.i-docs.local/backend/api/v1/templates/validate/" +
        id,
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

export const createTemplate = async (
  data: createTemplateApiArgs,
): Promise<createTemplateApiResponse | undefined> => {
  try {
    const response = await axios.post(
      "https://dev-alphabank9.i-docs.local/backend/api/v1/templates",
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

export const updateTemplate = async (
  data: updateTemplateApiArgs,
): Promise<createTemplateApiResponse | undefined> => {
  try {
    const response = await axios.put(
      `https://dev-alphabank9.i-docs.local/backend/api/v1/templates`,
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

type fetchTemplatesApiResponse = {
  message: string;
  errorCode: string;
  errorDetails: string[];
  timestamp: string;
  runtime: number;
  resultSize: number;
  data: Template[];
};

type fetchTemplateApiResponse = {
  message: string;
  errorCode: string;
  errorDetails: string[];
  timestamp: string;
  runtime: number;
  resultSize: number;
  data: Template;
};

export type createTemplateApiArgs = {
  filename: string;
  data: string;
};

type createTemplateApiResponse = {
  message: string;
  errorCode: string;
  errorDetails: string[];
  timestamp: string;
  runtime: number;
  resultSize: number;
  data: Template;
};

export type updateTemplateApiArgs = {
  id: number;
  name: string;
  description: string;
  version: string;
  filename: string;
  data: string;
  creationTs: string;
};
