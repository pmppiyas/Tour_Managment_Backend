import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

export const hashingPassword = async (password: string): Promise<string> => {
  const saltRound = Number(envVars.DCRYPT_SALT_ROUND);
  return await bcrypt.hash(password, saltRound);
};
