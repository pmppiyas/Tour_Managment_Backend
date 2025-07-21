import { Router } from "express";
import { TourController } from "./tour.controller";
import { validateRequest } from "../../Middlewares/validateRequest";
import { createTourZodObject } from "./tour.validation";
import { checkAuth } from "../../Middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

/// ------- Tour ----------///
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodObject),
  TourController.createTour
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.getAllTour
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodObject.partial()),
  TourController.updateTour
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTour
);

export const TourRoutes = router;
