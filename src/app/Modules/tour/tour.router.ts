import { Router } from "express";
import { TourController } from "./tour.controller";
import { validateRequest } from "../../Middlewares/validateRequest";
import { createTourZodObject } from "./tour.validation";

const router = Router();

router.post(
  "/create",
  validateRequest(createTourZodObject),
  TourController.createTour
);

export const TourRoutes = router;
