import { ErrorRequestHandler } from "express";
import { envVars } from "../../config/env";
import { AppError } from "../Error/appError";
import httpStatus from "http-status-codes";
import {
  errorSources,
  handleDuplicateError,
  handleZodValidatonError,
  validationError,
} from "../helper/ErrorHelperFunction";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = `Something went wrong !`;

  //Duplicate Error
  if (error.code === 11000) {
    const dupFunc = handleDuplicateError(error);
    statusCode = dupFunc.statusCode;
    message = dupFunc.message;
  }

  // Invalid Object ID Error
  else if (error.name === "CastError") {
    message = "Invalid MongoDB ObjectID. Please provide valid ID.";
  }

  //Validator Error
  else if (error.name === "ValidationError") {
    validationError(error);
  }

  //Zod Error
  if (error.name === "ZodError") {
    message = handleZodValidatonError(error).message;
    statusCode = httpStatus.NOT_ACCEPTABLE;
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
