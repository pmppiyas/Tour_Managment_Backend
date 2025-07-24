import { Router } from "express";
import { BookingController } from "./booking.controller";
import { checkAuth } from "../../Middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../Middlewares/validateRequest";
import { BookingValidation } from "./booking.validation";

const router = Router();

router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validateRequest(BookingValidation.createBookingValidation),
  BookingController.createBooking
);

router.get(
  "/all-bookings",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BookingController.getAllBooking
);

router.get(
  "/:bookingId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BookingController.getSingleBooking
);

router.get(
  "/my-booking",
  checkAuth(...Object.values(Role)),
  BookingController.getSingleBooking
);

router.patch(
  "/:bookingId/:status",
  checkAuth(...Object.values(Role)),
  validateRequest(BookingValidation.updateBookingValidation),
  BookingController.updateBooking
);

export const BookingRoutes = router;
