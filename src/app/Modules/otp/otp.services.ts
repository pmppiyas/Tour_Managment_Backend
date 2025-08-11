import { redisClient } from "../../../config/redis.config";
import { AppError } from "../../Error/appError";
import { genarateOtp } from "../../utils/genarateOtp";
import { sendEmail } from "../../utils/sendEmail";
import httpStatus from "http-status-codes";
import User from "../user/user.model";
const OTP_EXPIRATION = 60 * 2; //2 minute

const sendOtp = async (payload: Record<string, string>) => {
  if (!payload.email) {
    throw new AppError(httpStatus.NOT_FOUND, "Email not found");
  }
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found");
  }

  if (user.isVarified) {
    throw new AppError(httpStatus.CONFLICT, "User is already verified.");
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

const verifyOtp = async (payload: Record<string, string>) => {
  const redisKey = `otp:${payload.email}`;

  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp) {
    throw new AppError(httpStatus.EXPECTATION_FAILED, "Otp has been expired.");
  }

  if (savedOtp !== payload.otp) {
    throw new AppError(httpStatus.EXPECTATION_FAILED, "Invalid OTP");
  }

  await Promise.all([
    User.findOneAndUpdate(
      { email: payload.email },
      { $set: { isVarified: true } },
      { new: true, runValidators: true }
    ),
    redisClient.del(redisKey),
  ]);
};

export const OtpServices = {
  sendOtp,
  verifyOtp,
};
