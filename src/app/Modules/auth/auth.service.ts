import { envVars } from "./../../../config/env";
import httpsStatus from "http-status-codes";
import { AppError } from "../../Error/appError";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const IsUserExist = await User.findOne({ email });
  if (!IsUserExist) {
    throw new AppError(httpsStatus.BAD_REQUEST, "User does not exist");
  }

  const IsPasswordMatch = await bcryptjs.compare(
    password as string,
    IsUserExist.password as string
  );
  if (!IsPasswordMatch) {
    throw new AppError(httpsStatus.BAD_REQUEST, "Incorrect Password");
  }
  const jwtPayload = {
    userId: IsUserExist._id,
    email: IsUserExist.email,
    role: IsUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_TOKEN,
    envVars.JWT_ACCESS_EXPIRED
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
};
