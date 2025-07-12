import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createZodUser } from "./user.validation";
import { validateRequest } from "../../Middlewares/validateRequest";
const router = Router();

router.post(
  "/register",
  validateRequest(createZodUser),
  UserControllers.createUser
);
router.get("/all-users", UserControllers.getAllUsers);

export const UserRoutes = router;
