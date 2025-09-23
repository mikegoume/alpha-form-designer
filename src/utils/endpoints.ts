import { FormConfig, FormInputElementType, FormValues } from "../types/form";

/**
 * Parses service parameters and extracts actual values from filled values using form metadata.
 */
export function mapServiceParamsToValues(
  serviceParams: any[],
  formDefinition: FormConfig,
  filledValues: FormValues,
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const param of serviceParams) {
    if (param.type === "input_key") {
      const formVar = formDefinition.formVariables.find(
        (v) => v.name === param.value,
      );
      if (formVar) {
        const value = filledValues[formVar.id];
        if (value !== undefined) {
          result[param.value] = value;
        }
      }
    }
  }

  return result;
}

/**
 * Parses service parameters and extracts actual values from filled values using form metadata.
 */
export function mapRequestParamsToValues(
  requestParameters: any[],
  formDefinition: FormConfig,
  filledValues: FormValues,
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const param of requestParameters) {
    if (param.type === "input_key") {
      const formVar = formDefinition?.formVariables?.find(
        (v) => (v as FormInputElementType).name === param.value,
      );
      if (formVar) {
        const value = filledValues[formVar.id];
        if (value !== undefined) {
          result[param.origin] = value;
        }
      }
    }
  }

  return result;
}

export function updateFormValuesFromApiResponse(
  apiResponse: Record<string, any>,
  formDefinition: FormConfig,
  filledValues: Record<string, any>,
): Record<string, any> {
  const updatedValues = { ...filledValues };

  for (const key of Object.keys(apiResponse)) {
    const variable = formDefinition.formVariables.find((v) => v.label === key);
    if (variable) {
      updatedValues[(variable as FormInputElementType).id] = apiResponse[key];
    }
  }

  return updatedValues;
}
