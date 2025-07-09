import { Request, Response, NextFunction } from "express";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserServices.createUser(req.body);
    res.status(201).send({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const UserControllers = {
  createUser,
};
