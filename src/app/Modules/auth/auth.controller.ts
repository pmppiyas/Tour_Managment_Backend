/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import passport from "passport";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import { clearAuthCookies } from "../../utils/clearCookie";
import { createUserTokens } from "../../utils/userTokens";
import { AppError } from "../../Error/appError";
import { envVars } from "../../../config/env";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(httpStatus.METHOD_FAILURE, err));
      }

      if (!user) {
        return next(new AppError(httpStatus.NOT_FOUND, info.message));
      }

      const userToken = createUserTokens(user);

      setAuthCookie(res, info?.message);

      const { password: _password, ...rest } = user.toObject();

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Login Successfully",
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
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

const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, id } = req.body;
    await AuthServices.forgetPassword(email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reset email send successfully.",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);

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

    res.redirect(`${envVars.BACKENT_URL}/${redirectTo}`);
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
  forgetPassword,
  googleCallback,
};
