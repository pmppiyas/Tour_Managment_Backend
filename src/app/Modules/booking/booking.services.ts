import { IBooking } from "./booking.interface";

const createBooking = async (payload: IBooking) => {
  console.log("Booking created with payload:", payload);
};

const getAllBookings = async () => {
  console.log("Fetching all bookings");
};

const getSingleBooking = async (id: string) => {
  console.log("Fetching booking with ID:", id);
};

const getMyBooking = async (userId: string) => {
  console.log("Fetching bookings for user ID:", userId);
};

const updateBooking = async (bookingId: string, status: string) => {
  console.log(`Updating booking ${bookingId} to status ${status}`);
};

export const BookingServices = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getMyBooking,
};
