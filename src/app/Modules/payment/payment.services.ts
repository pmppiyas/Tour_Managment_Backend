import { BookingStatus } from "../booking/booking.interface";
import Booking from "../booking/booking.model";
import { PaymentStatus } from "./payment.interface";
import Payment from "./payment.model";

const successPayment = async (query: any) => {
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
    console.log("Payment Update:", paymentUpdate);

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
    console.error("Transaction failed:", error);
    return;
  }
};

const failPayment = async (req, res) => {
  // Update booking status to failed
  // Update payment status to failed
};
const cancelPayment = async (req, res) => {
  // Update booking status to cancelled
  // Update payment status to cancelled
};

export const PaymentServices = {
  successPayment,
};
