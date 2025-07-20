import { Router } from "express";
import { UserRoutes } from "../Modules/user/user.router";
import { AuthRoutes } from "../Modules/auth/auth.router";
import { DivisonRoutes } from "../Modules/division/division.router";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
