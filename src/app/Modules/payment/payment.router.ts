import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/success", PaymentController.successPayment);
// router.post("/fail");
// router.post("/cancel");

export const PaymentRoute = router;
