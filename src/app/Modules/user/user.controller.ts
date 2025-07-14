import { JwtPayload } from "jsonwebtoken";
import { verifyToken, verifyToken } from "./../../utils/jwt";
import httpStatus from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { envVars } from "../../../config/env";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User create successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUser();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All user retrieved successfully",
      data: result.users,
      meta: result.meta,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   envVars.JWT_ACCESS_TOKEN
    // );
    const verifiedToken = req.user;
    const user = await UserServices.updateUser(
      userId,
      req.body,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User updated successfully",
      data: user,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
};
