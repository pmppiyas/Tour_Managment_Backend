import { JwtPayload } from "jsonwebtoken";
import { createNewAccessTokenWithRefreshToken } from "./../../utils/userTokens";
import httpStatus from "http-status-codes";
import { AppError } from "../../Error/appError";
import User from "../user/user.model";
import bcryptjs from "bcryptjs";

import { hashingPassword } from "../../utils/hashingPassword";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const IsUserExist = await User.findOne({ email });
//   if (!IsUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
//   }

//   const IsPasswordMatch = await bcryptjs.compare(
//     password as string,
//     IsUserExist.password as string
//   );

//   if (!IsPasswordMatch) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
//   }

//   const userTokens = createUserTokens(IsUserExist);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: _password, ...userWithoutPassword } =
//     IsUserExist.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: userWithoutPassword,
//   };
// };

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return newAccessToken;
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
): Promise<boolean> => {
  const user = await User.findById(decodedToken.userId);

  if (!user || !user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User not found or password missing"
    );
  }

  if (oldPassword === newPassword) {
    throw new AppError(
      httpStatus.METHOD_FAILURE,
      "Please give defferent new password"
    );
  }
  const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password);

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect old password");
  }

  user.password = await hashingPassword(newPassword);

  await user.save();

  return true;
};

export const AuthServices = {
  getNewAccessToken,
  resetPassword,
};
