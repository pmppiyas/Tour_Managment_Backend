import { z } from "zod";
import { BookingStatus } from "./booking.interface";

const createBookingValidation = z.object({
  tour: z.string().nonempty("Tour ID is required"),
  guestCount: z.number().min(1, "Guest count must be at least 1"),
});

const updateBookingValidation = z.object({
  status: z.enum(Object.values(BookingStatus) as [string, ...string[]]),
});

export const BookingValidation = {
  createBookingValidation,
  updateBookingValidation,
};
