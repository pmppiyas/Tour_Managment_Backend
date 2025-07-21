import { Router } from "express";
import { TourController } from "./tour.controller";
import { validateRequest } from "../../Middlewares/validateRequest";
import { createTourZodObject, tourTypeZodObject } from "./tour.validation";
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

// router.get(
//   "/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   TourController.getSingleTour
// );

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

///-----Tour Type ----------///

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourTypeZodObject),
  TourController.createTourType
);

router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourTypeZodObject.partial()),
  TourController.updateTourType
);

router.get(
  "/tour-types",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.getAllTourTypes
);

router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTourType
);

export const TourRoutes = router;
