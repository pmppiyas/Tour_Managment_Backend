import { envVars } from "./../../config/env";
import User from "../Modules/user/user.model";
import { IAuthProviders, IUser, Role } from "../Modules/user/user.interface";
import bcrypt from "bcryptjs";
export const seedSUperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log("Super Admin \n", isSuperAdminExist);
      return;
    }

    console.log("Trying to create super admin");

    const hashPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.DCRYPT_SALT_ROUND)
    );
    const authProvider: IAuthProviders = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashPassword,
      auths: [authProvider],
      isVarified: true,
    };
    const superAdmin = await User.create(payload);
    console.log("Super Admin Created Successfully! \n");
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
