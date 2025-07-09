export class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, messsage: string, stack: "") {
    super(messsage);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
