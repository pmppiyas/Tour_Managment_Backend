/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
interface errType {
  path: string;
  message: string;
}

export let errorSources: errType[] = [];
const errMode: any = [];
let missing: any = [];

export const handleDuplicateError = (error: any) => {
  const match = error.message.match(/dup key:\s*{ (\w+): "(.*?)" }/);
  if (match) {
    const field = match[1];
    const value = match[2];

    return {
      message: `Duplicate ${field} "${value}" already exists    `,
      statusCode: httpStatus.METHOD_FAILURE,
    };
  } else {
    return {
      message: "Duplicate value already exists",
      statusCode: httpStatus.METHOD_FAILURE,
    };
  }
};

export const handleZodValidatonError = (error: any) => {
  const errors = Object.values(error.errors);
  errorSources = [];
  missing = [];
  errors.forEach((errObj: any) => {
    const path = Array.isArray(errObj.path) ? errObj.path[0] : errObj.path;

    errorSources.push({
      path: path,
      message: errObj.message,
    });
  });

  errorSources.forEach((pb) => missing.push(pb.path));

  errors.forEach((item) => errMode.push(item));

  if (errMode[0].received === "undefined") {
    return {
      message: `${missing.map(
        (item: string) => item.charAt(0).toUpperCase() + item.slice(1)
      )} is required`,
    };
  } else {
    return {
      message: `${
        errorSources[0].message.charAt(0).toUpperCase() +
        errorSources[0].message.slice(1)
      }`,
    };
  }
};

export const validationError = (error: any) => {
  const errors = Object.values(error.errors);

  errors.forEach((errObj: any) =>
    errorSources.push({ path: errObj.path, message: errObj.message })
  );

  return { message: `Somethings wrong with ${error.name}` };
};
