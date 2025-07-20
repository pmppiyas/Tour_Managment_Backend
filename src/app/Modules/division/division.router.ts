import { Router } from "express";
import { checkAuth } from "../../Middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DivisionController } from "./division.controller";
import { validateRequest } from "../../Middlewares/validateRequest";
import { createDivisionZodSchema } from "./division.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDivisionZodSchema),
  DivisionController.createDivision
);

export const DivisonRoutes = router;
