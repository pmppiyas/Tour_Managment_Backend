import { BookingStatus } from "../booking/booking.interface";
import Booking from "../booking/booking.model";
import { PaymentStatus } from "./payment.interface";
import Payment from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const transactionId = query.tran_id;

    const paymentUpdate = await Payment.findOneAndUpdate(
      {
        transactionId,
      },
      { status: PaymentStatus.PAID },
      {
        session,
        new: true,
        runValidators: true,
      }
    );

    if (!paymentUpdate?.booking) {
      throw new Error("Payment not linked to booking.");
    }

    await Booking.findByIdAndUpdate(
      paymentUpdate.booking,
      { status: BookingStatus.CONFIRMED },
      {
        session,
        new: true,
        runValidators: true,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment and booking completed successfully.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const transactionId = query.tran_id;

    const paymentUpdate = await Payment.findOneAndUpdate(
      {
        transactionId,
      },
      { status: PaymentStatus.FAILED },
      {
        session,
        new: true,
        runValidators: true,
      }
    );

    if (!paymentUpdate?.booking) {
      throw new Error("Payment not linked to booking.");
    }

    await Booking.findByIdAndUpdate(
      paymentUpdate.booking,
      { status: BookingStatus.FAILED },
      {
        session,
        new: true,
        runValidators: true,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment and booking  is failed.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const transactionId = query.tran_id;

    const paymentUpdate = await Payment.findOneAndUpdate(
      {
        transactionId,
      },
      { status: PaymentStatus.CENCELLED },
      {
        session,
        new: true,
        runValidators: true,
      }
    );

    if (!paymentUpdate?.booking) {
      throw new Error("Payment not linked to booking.");
    }

    await Booking.findByIdAndUpdate(
      paymentUpdate.booking,
      { status: BookingStatus.CANCELLED },
      {
        session,
        new: true,
        runValidators: true,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment and booking  is cancel.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
};
