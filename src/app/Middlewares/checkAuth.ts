import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../Error/appError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../../config/env";

export const checkAuth =
  (...authRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No Token Recived");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_TOKEN
      ) as JwtPayload;
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted for this route");
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
