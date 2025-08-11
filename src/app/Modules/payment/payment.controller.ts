import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { PaymentServices } from "./payment.services";
import { envVars } from "../../../config/env";
import sendResponse from "../../utils/sendResponse";
import { AppError } from "../../Error/appError";

const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Success Hitted");
      const result = await PaymentServices.successPayment(
        req.query as Record<string, string>
      );
      if (result?.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?tran_id=${req.query.tran_id}&amount=${req.query.amount}&status=${req.query.status}
      `);
      }
    } catch (err) {
      console.log(err);
      throw new AppError(500, "Matha Nosto Mia Vai");
    }
  }
);
const failPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.failPayment(
    req.query as Record<string, string>
  );
  if (!result?.success) {
    res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?tran_id=${req.query.tran_id}&amount=${req.query.amount}&status=${req.query.status}
      `);
  }
});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.cancelPayment(
    req.query as Record<string, string>
  );
  if (!result?.success) {
    res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?tran_id=${req.query.tran_id}&amount=${req.query.amount}&status=${req.query.status}
      `);
  }
});

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  const result = await PaymentServices.initPayment(bookingId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking payment successfull",
    data: result,
  });
});
export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
