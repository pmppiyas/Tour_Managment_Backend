import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createZodUser } from "./user.validation";
import { validateRequest } from "../../Middlewares/validateRequest";
import { checkAuth } from "../../Middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createZodUser),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);

export const UserRoutes = router;
