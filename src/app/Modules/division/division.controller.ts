import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { DivisionServices } from "./division.services";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const division = await DivisionServices.createDivision(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Division create successfully",
      data: division,
    });
  }
);

const getAllDivisions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DivisionServices.getAllDivisions();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All division retrieved",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const result = DivisionServices.getSingleDivision(slug);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division Retrieved",
      data: (await result).data,
    });
  }
);

const upadteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await DivisionServices.updateDivision(id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Division updated successfully",
      data: result,
    });
  }
);

const deleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await DivisionServices.deleteDivision(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Division deleted successfully",
      data: result,
    });
  }
);

export const DivisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  upadteDivision,
  deleteDivision,
};
