import passport from "passport";
import { Router, Request, Response, NextFunction } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../Middlewares/checkAuth";
import { Role } from "../user/user.interface";
const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);

router.post("/forget-password", AuthControllers.forgetPassword);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthControllers.googleCallback
);
export const AuthRoutes = router;
