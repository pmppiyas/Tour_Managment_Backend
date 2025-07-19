import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../Error/appError";
import { IAuthProviders, IUser, Role } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../../config/env";
import { hashingPassword } from "../../utils/hashingPassword";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const ifUserExist = await User.findOne({ email });
  if (ifUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }
  const hashPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.DCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProviders = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUser = async () => {
  const users = await User.find({});
  const totalUser = await User.countDocuments();
  return {
    users,
    meta: {
      total: totalUser,
    },
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (
    userId !== decodedToken.userId &&
    decodedToken.role !== Role.ADMIN &&
    decodedToken.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  const userExist = await User.findById(userId);

  if (!userExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "Sorry you are not authorized");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Sorry you can't update admin to super_admin."
      );
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVarified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Sorry you can't change any status"
      );
    }
  }
  if (payload.password) {
    payload.password = await hashingPassword(payload.password);
  }
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdatedUser;
};

export const UserServices = {
  createUser,
  getAllUser,
  updateUser,
};
