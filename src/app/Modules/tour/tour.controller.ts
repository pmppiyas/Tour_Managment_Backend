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

export const TourController = {
  createTour,
};
