import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { PaymentServices } from "./payment.services";
import { envVars } from "../../../config/env";

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.successPayment(
    req.query as Record<string, string>
  );
  if (result?.success) {
    res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?tran_id=${req.query.tran_id}&amount=${req.query.amount}&status=${req.query.status}
      `);
  }
});
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

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
};
