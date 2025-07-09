import { ErrorRequestHandler } from "express";
import { envVars } from "../../config/env";
import { AppError } from "../Error/appError";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next
) => {
  let statusCode = 500;
  let message = `Something went wrong!`;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }
  res.status(statusCode).json({
    success: true,
    message,
    error,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
