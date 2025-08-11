import { redisClient } from "../../../config/redis.config";
import { AppError } from "../../Error/appError";
import { genarateOtp } from "../../utils/genarateOtp";
import { sendEmail } from "../../utils/sendEmail";
import httpStatus from "http-status-codes";
const OTP_EXPIRATION = 60 * 2; //2 minute

const sendOtp = async (payload: Record<string, string>) => {
  if (!payload.email) {
    throw new AppError(httpStatus.NOT_FOUND, "Email not found");
  }

  const otp = genarateOtp(6);

  const redisKey = `otp:${payload.email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: payload.email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name: payload.name || "Dear User",
      otp: otp,
    },
  });
};

const verifyOtp = async () => {
  console.log("Otp verify");
};

export const OtpServices = {
  sendOtp,
  verifyOtp,
};
