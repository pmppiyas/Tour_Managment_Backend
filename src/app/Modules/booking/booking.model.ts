import mongoose, { Schema } from "mongoose";
import { BookingStatus, IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  tour: {
    type: Schema.Types.ObjectId,
    ref: "Tour",
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
    default: null,
  },
  geustCount: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING,
  },
});

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
