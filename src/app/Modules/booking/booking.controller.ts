import catchAsync from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.services";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await BookingServices.createBooking(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking successfully.",
      data: result,
    });
  }
);

const getAllBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await BookingServices.createBooking(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "All booking retrieved successfully.",
      data: result,
    });
  }
);

const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await BookingServices.getAllBookings();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Single booking retrieved successfully.",
      data: result,
    });
  }
);

const getMyBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await BookingServices.getSingleBooking(req.user.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My booking retrieved successfully.",
      data: result,
    });
  }
);

const updateBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await BookingServices.getMyBooking(req.params.bookingId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking updated successfully.",
      data: result,
    });
  }
);

export const BookingController = {
  createBooking,
  getAllBooking,
  getSingleBooking,
  getMyBooking,
  updateBooking,
};
