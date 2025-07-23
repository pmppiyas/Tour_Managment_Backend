import { Types } from "mongoose";
// user - Booking pending => Payment(Unpaid)=> SSLCommerz => Booking Updated = confirmed => Payment updated = paid

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment?: Types.ObjectId;
  geustCount: number;
  bookingDate?: Date;
  status: BookingStatus;
}
