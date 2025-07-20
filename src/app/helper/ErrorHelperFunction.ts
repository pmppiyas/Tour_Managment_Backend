/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";

interface errType {
  path: string;
  message: string;
}

export let errorSources: errType[] = [];
let errMode: any[] = [];
let missing: string[] = [];

// 🔁 Reset helper to keep things clean across multiple calls
const resetState = () => {
  errorSources = [];
  errMode = [];
  missing = [];
};

// 🧩 MongoDB Duplicate Key Error Handler
export const handleDuplicateError = (error: any) => {
  resetState();

  const keyValue = error.keyValue;
  if (keyValue) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

    return {
      message: `Duplicate ${field} "${value}" already exists`,
      statusCode: httpStatus.METHOD_FAILURE,
    };
  }

  return {
    message: "Duplicate value already exists",
    statusCode: httpStatus.METHOD_FAILURE,
  };
};

// 📦 Zod Validation Error Handler
export const handleZodValidatonError = (error: any) => {
  resetState();

  const errors = Object.values(error.errors);
  errors.forEach((errObj: any) => {
    const path = Array.isArray(errObj.path) ? errObj.path[0] : errObj.path;

    errorSources.push({
      path: path,
      message: errObj.message,
    });

    if (path) {
      missing.push(path);
    }

    errMode.push(errObj);
  });

  const capitalizedFields = missing
    .map((item: string) =>
      item ? item.charAt(0).toUpperCase() + item.slice(1) : "Field"
    )
    .join(", ");

  const prefix =
    errMode[0]?.received === "undefined"
      ? "Missing required field"
      : "Wrong value in";

  return {
    message: `${prefix}: ${capitalizedFields}`,
    statusCode: httpStatus.BAD_REQUEST,
  };
};

// 🛠️ General Mongoose Validation Error
export const validationError = (error: any) => {
  resetState();

  const errors = Object.values(error.errors);
  errors.forEach((errObj: any) =>
    errorSources.push({ path: errObj.path, message: errObj.message })
  );

  return {
    message: `Something’s wrong with ${error.name}`,
    statusCode: httpStatus.BAD_REQUEST,
  };
};
