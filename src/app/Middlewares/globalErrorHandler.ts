/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ErrorRequestHandler } from "express";
import { envVars } from "../../config/env";
import { AppError } from "../Error/appError";
import httpStatus from "http-status-codes";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = `Something went wrong !`;

  interface errType {
    path: string;
    message: string;
  }
  const errorSources: errType[] = [];
  const errMode: any = [];
  //Duplicate Error
  if (error.code === 11000) {
    const match = error.message.match(/dup key:\s*{ (\w+): "(.*?)" }/);
    if (match) {
      const field = match[1];
      const value = match[2];
      message = `Duplicate ${field} "${value}" already exists`;
      statusCode = httpStatus.METHOD_FAILURE;
    } else {
      message = "Duplicate value already exists";
      statusCode = httpStatus.METHOD_FAILURE;
    }
  }

  // Invalid Object ID Error
  else if (error.name === "CastError") {
    message = "Invalid MongoDB ObjectID. Please provide valid ID.";
  }

  //Validator Error
  else if (error.name === "ValidationError") {
    const errors = Object.values(error.errors);

    errors.forEach((errObj: any) =>
      errorSources.push({ path: errObj.path, message: errObj.message })
    );

    message = error.name;
  }

  //Zod Error
  if (error.name === "ZodError") {
    const missing: any = [];
    const errors = Object.values(error.errors);

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
      message = `${missing.map(
        (item: string) => item.charAt(0).toUpperCase() + item.slice(1)
      )} is required`;
    } else {
      message = `${
        errorSources[0].message.charAt(0).toUpperCase() +
        errorSources[0].message.slice(1)
      }`;
    }
  }

  //
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    error: errorSources.length > 0 ? errorSources : error,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
