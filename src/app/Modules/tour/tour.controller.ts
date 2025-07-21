import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { TourServices } from "./tour.services";
import sendResponse from "../../utils/sendResponse";

const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.createTour(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Division created successfully.",
      data: result,
    });
  }
);

const getAllTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.getAllTour(req.params);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "All tour retrieved successfully.",
      data: result,
    });
  }
);

const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.updateTour(req.params.id, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "All tour retrieved successfully.",
      data: result,
    });
  }
);

export const TourController = {
  createTour,
  getAllTour,
  updateTour,
};
