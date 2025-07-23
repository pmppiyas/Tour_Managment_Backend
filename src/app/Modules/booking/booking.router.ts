import { Router } from "express";
import { BookingController } from "./booking.controller";
import { checkAuth } from "../../Middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/create",
  checkAuth(...Object.values(Role)),
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

router.patch("/:bookingId/:status", BookingController.updateBooking);
export const BookingRoutes = router;
