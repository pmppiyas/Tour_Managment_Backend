import { Router } from "express";
import { UserRoutes } from "../Modules/user/user.router";
import { AuthRoutes } from "../Modules/auth/auth.router";
import { DivisonRoutes } from "../Modules/division/division.router";
import { TourRoutes } from "../Modules/tour/tour.router";
import { BookingRoutes } from "../Modules/booking/booking.router";
import { PaymentRoute } from "../Modules/payment/payment.router";
import { OtpRoute } from "../Modules/otp/otp.router";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/division",
    route: DivisonRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoute,
  },
  {
    path: "/otp",
    route: OtpRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
