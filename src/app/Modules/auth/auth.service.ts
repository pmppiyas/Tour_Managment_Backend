import { createNewAccessTokenWithRefreshToken } from "./../../utils/userTokens";
import httpsStatus from "http-status-codes";
import { AppError } from "../../Error/appError";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createUserTokens } from "../../utils/userTokens";

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

  const userTokens = createUserTokens(IsUserExist);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } =
    IsUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: userWithoutPassword,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return newAccessToken;
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};
