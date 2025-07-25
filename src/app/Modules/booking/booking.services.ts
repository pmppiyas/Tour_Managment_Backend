import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../Error/appError";
import User from "../user/user.model";
import { IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import Booking from "./booking.model";
import Payment from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { SslServices } from "../sslCommerz/ssl.services";
const createBooking = async (payload: IBooking, decodedUser: JwtPayload) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(decodedUser.userId).session(session);

    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Please update your profile with phone and address."
      );
    }

    if (!payload.tour) {
      throw new AppError(httpStatus.BAD_REQUEST, "Tour ID is required.");
    }

    if (!payload.guestCount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Guest count must be at least 1."
      );
    }

    //  Make Booking
    const booking = await Booking.create(
      [
        {
          ...payload,
          user: user._id,
        },
      ],
      { session }
    );

    const tourData = await Tour.findById(payload.tour).session(session);

    if (!tourData || !tourData?.costFrom || !tourData?.maxGuest) {
      throw new AppError(httpStatus.NOT_FOUND, "Something missing about tour.");
    }

    if (payload.guestCount <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Guest count must be at least 1."
      );
    }

    if (payload.guestCount > tourData?.maxGuest) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Guest count exceeds maximum group size of ${tourData.maxGuest}.`
      );
    }

    // Make Payment
    const payment = await Payment.create(
      [
        {
          user: user._id,
          booking: booking[0]._id,
          transactionId: `txn_${Date.now()}_${Math.floor(
            Math.random() * 1000
          )}`,
          amount: payload.guestCount * tourData?.costFrom,
        },
      ],
      { session }
    );

    if (!payment) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Payment creation failed."
      );
    }

    // Update Booking with Payment
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      {
        payment: payment[0]._id,
      },
      {
        session,
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

    // SSL PAYMENT INIT
    const sslPayment = await SslServices.sslPaymentInit({
      name: user.name,
      email: user.email,
      amount: payment[0].amount,
      transactionId: payment[0].transactionId,
      phone: user.phone,
      address: user.address,
    });
    await session.commitTransaction();
    session.endSession();
    return {
      booking: updatedBooking,
      paymentUrl: sslPayment.GatewayPageURL,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
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
