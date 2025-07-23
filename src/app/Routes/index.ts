import { Router } from "express";
import { UserRoutes } from "../Modules/user/user.router";
import { AuthRoutes } from "../Modules/auth/auth.router";
import { DivisonRoutes } from "../Modules/division/division.router";
import { TourRoutes } from "../Modules/tour/tour.router";
import { BookingRoutes } from "../Modules/booking/booking.router";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
