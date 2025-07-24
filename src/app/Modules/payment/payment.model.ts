import mongoose, { Schema } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      unique: true,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: Schema.Types.Mixed,
      default: null,
    },
    invoiceUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
