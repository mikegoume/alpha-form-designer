import axios, { isAxiosError } from "axios";

import { Form } from "../types/form";

export const fetchForms = async (): Promise<
  fetchFormsApiResponse | undefined
> => {
  try {
    const response = await axios.get(
      "https://dev-alphabank9.i-docs.local/backend/api/v1/forms",
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

export const fetchForm = async (
  id: number,
): Promise<createFormApiResponse | undefined> => {
  try {
    const response = await axios.get(
      "https://dev-alphabank9.i-docs.local/backend/api/v1/forms/" + id,
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

export const createForm = async (
  data: createFormApiArgs,
): Promise<createFormApiResponse | undefined> => {
  try {
    const response = await axios.post(
      "https://dev-alphabank9.i-docs.local/backend/api/v1/forms",
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

export const updateForm = async (
  data: updateFormApiArgs,
): Promise<createFormApiResponse | undefined> => {
  try {
    const response = await axios.put(
      "https://dev-alphabank9.i-docs.local/backend/api/v1/forms",
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

export const deleteForm = async (
  id: number,
): Promise<createFormApiResponse | undefined> => {
  try {
    const response = await axios.delete(
      "https://dev-alphabank9.i-docs.local/backend/api/v1/forms/" + id,
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

type fetchFormsApiResponse = {
  message: string;
  errorCode: string;
  errorDetails: string[];
  timestamp: string;
  runtime: number;
  resultSize: number;
  data: Form[];
};

export type createFormApiArgs = {
  templateId: number;
  name: string;
  description: string;
  version: string;
  json: string;
  status: string;
};

export type createFormApiResponse = {
  message: string;
  errorCode: string;
  errorDetails: string[];
  timestamp: string;
  runtime: number;
  resultSize: number;
  data: Form;
};

export type updateFormApiArgs = {
  id: number;
  name: string;
  description: string;
  version: string;
  json: string;
  status: string;
};
