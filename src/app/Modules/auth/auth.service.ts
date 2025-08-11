/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { createNewAccessTokenWithRefreshToken } from "./../../utils/userTokens";
import httpStatus from "http-status-codes";
import { AppError } from "../../Error/appError";
import User from "../user/user.model";
import bcryptjs from "bcryptjs";
import httpsStatus from "http-status-codes";
import { hashingPassword } from "../../utils/hashingPassword";
import { IsActive } from "../user/user.interface";
import jwt from "jsonwebtoken";
import { envVars } from "../../../config/env";
import { sendEmail } from "../../utils/sendEmail";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return newAccessToken;
};

const forgetPassword = async (email: string) => {
  console.log(email);

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpsStatus.BAD_REQUEST, "User does not exist");
  }

  if (
    isUserExist.isActive === IsActive.BLOCK ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpsStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpsStatus.BAD_REQUEST, "User is deleted");
  }

  const JwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(JwtPayload, envVars.JWT_ACCESS_TOKEN, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};

const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
): Promise<boolean> => {
  if (!payload.id) {
    throw new AppError(httpStatus.NOT_FOUND, "Paylod userId not found!");
  }
  if (!payload.email) {
    throw new AppError(httpStatus.NOT_FOUND, "Paylod email not found!");
  }
  if (!payload.newInputPassword) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Paylod newInputPassword not found!"
    );
  }
  if (payload.id !== decodedToken.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot reset other's password."
    );
  }

  const isUserExist = await User.findById(decodedToken.userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  const hashedPassword = await hashingPassword(payload.newInputPassword);

  isUserExist.password = hashedPassword;

  await isUserExist.save();

  return true;
};

export const AuthServices = {
  getNewAccessToken,
  resetPassword,
  forgetPassword,
};
