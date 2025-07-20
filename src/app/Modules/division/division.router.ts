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

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.getAllDivisions
);

router.get(
  "/:slug",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.getSingleDivision
);

export const DivisonRoutes = router;
