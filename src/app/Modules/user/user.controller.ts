import httpStatus from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

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

export const UserControllers = {
  createUser,
  getAllUsers,
};
