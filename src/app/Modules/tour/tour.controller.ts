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
    const query = req.query as Record<string, string>;

    const result = await TourServices.getAllTour(query);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "All tour retrieved successfully.",
      data: result,
    });
  }
);

const getSingleTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.getSingleTour(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Single tour retrieved successfully.",
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
      message: "Tour updated successfully.",
      data: result,
    });
  }
);

const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.tourDelete(req.params.id);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour deleted successfully.",
      data: result,
    });
  }
);

///-----Tour Type-----////

const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.createTourType(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour type created successfully.",
      data: result,
    });
  }
);

const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.updateTourType(req.params.id, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour type updated successfully.",
      data: result,
    });
  }
);

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await TourServices.getAllTourTypes();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour types retrieved successfully",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourServices.deleteTourType(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type deleted successfully",
    data: result,
  });
});

export const TourController = {
  createTour,
  getAllTour,
  getSingleTour,
  updateTour,
  deleteTour,

  // ----Tour Type----//
  createTourType,
  updateTourType,
  getAllTourTypes,
  deleteTourType,
};
