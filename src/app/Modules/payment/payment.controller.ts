import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { PaymentServices } from "./payment.services";
import { envVars } from "../../../config/env";

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.successPayment(req.query);
  console.log("Success Payment", result);
  if (result?.success) {
    res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?tran_id=${req.query.tran_id}&amount=${req.query.amount}&status=${req.query.status}
      `);
  }
});
// const failPayment = catchAsync(async (req: Request, res: Response) => {});
// const cancelPayment = catchAsync(async (req: Request, res: Response) => {});

export const PaymentController = {
  successPayment,
  //   failPayment,
  //   cancelPayment,
};
