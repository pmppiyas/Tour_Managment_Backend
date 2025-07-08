import { Request, Response } from "express";
import User from "./user.model";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await User.create({
      name,
      email,
    });
    res.status(201).send({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({
      success: false,
      message: "Create user unsuccessfull from server.",
      error: errorMessage,
    });
  }
};

export const UserControllers = {
  createUser,
};
