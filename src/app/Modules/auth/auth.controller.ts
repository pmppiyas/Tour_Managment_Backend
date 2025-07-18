import { JwtPayload } from "jsonwebtoken";
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import { clearAuthCookies } from "../../utils/clearCookie";
import { createUserTokens } from "../../utils/userTokens";
import { AppError } from "../../Error/appError";
import httpStatus from "http-status-codes";
import { envVars } from "../../../config/env";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Login Successfully",
      data: loginInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies["refresh-token"];
    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Token Genarete Successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    clearAuthCookies(res);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logout successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newInputPassword = req.body.newPassword;
    const decodedToken = req.user;

    await AuthServices.resetPassword(
      oldPassword,
      newInputPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password reset successfully",
      data: null,
    });
  }
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state
      ? (req.query.state as string)
      : ("" as string);

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const tokenInfo = await createUserTokens(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTENT_URL}/${redirectTo}`);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password reset successfully",
      data: null,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallback,
};
