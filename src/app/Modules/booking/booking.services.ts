import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../Error/appError";
import User from "../user/user.model";
import { IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import Booking from "./booking.model";
import Payment from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
const createBooking = async (payload: IBooking, decodedUser: JwtPayload) => {
  const user = await User.findById(decodedUser.userId);

  if (!user?.phone || !user?.address) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Please update your profile with phone and address."
    );
  }

  const { tour, guestCount } = payload;

  if (!tour) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour ID is required.");
  }

  if (!guestCount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Guest count must be at least 1."
    );
  }

  const booking = await Booking.create({
    ...payload,
    user: user._id,
  });

  const tourData = await Tour.findById(payload.tour);
  if (!tourData || !tourData?.costFrom || !tourData?.maxGuest) {
    throw new AppError(httpStatus.NOT_FOUND, "Something missing about tour.");
  }

  if (booking.guestCount > tourData?.maxGuest) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Guest count exceeds maximum group size of ${tourData.maxGuest}.`
    );
  }

  const payment = await Payment.create({
    user: user._id,
    booking: booking._id,
    transactionId: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    amount: booking.guestCount * tourData?.costFrom,
  });

  if (!payment) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Payment creation failed."
    );
  }
  const updatedBooking = await Booking.findByIdAndUpdate(
    booking._id,
    {
      payment: payment._id,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("user", "name email phone address")
    .populate("tour", "title costFrom maxGuest")
    .populate("payment", "transactionId amount status");

  if (!updatedBooking) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Booking update failed."
    );
  }

  return {
    booking: updatedBooking,
  };
};

const getAllBookings = async () => {
  console.log("Fetching all bookings");
};

const getSingleBooking = async (id: string) => {
  console.log("Fetching booking with ID:", id);
};

const getMyBooking = async () => {
  console.log("Fetching bookings for user ID:");
};

const updateBooking = async (bookingId: string, status: string) => {
  console.log(`Updating booking ${bookingId} to status ${status}`);
};

export const BookingServices = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getMyBooking,
  updateBooking,
};
