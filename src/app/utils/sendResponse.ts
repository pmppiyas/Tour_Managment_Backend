import { Response } from "express";
interface Tmeta {
  total: number;
}

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: Tmeta;
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  if (res.headersSent) return;
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};

export default sendResponse;
