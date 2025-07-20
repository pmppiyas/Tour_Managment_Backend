import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { DivisionServices } from "./division.services";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const division = await DivisionServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Division create successfully",
      data: division,
    });
  }
);

export const DivisionController = {
  createDivision,
};
