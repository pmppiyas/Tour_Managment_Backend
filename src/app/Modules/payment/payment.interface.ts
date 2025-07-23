import { Types } from "mongoose";

export enum PaymentStatus {
  UNPAID = "unpaid",
  PAID = "paid",
  CENCELLED = "cancelled",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface IPayment {
  user: Types.ObjectId;
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentMethod?: any;
  invoiceUrl?: string;
  paymentDate?: Date;
  status: PaymentStatus;
}
