import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OtpServices } from "./otp.services";

const sendOtp = catchAsync(async (req: Request, res: Response) => {
  await OtpServices.sendOtp(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Otp send successfully.",
    data: null,
  });
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  await OtpServices.verifyOtp(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Otp verify successfully.",
    data: null,
  });
});

export const OtpControllers = {
  sendOtp,
  verifyOtp,
};
