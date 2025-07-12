import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "QUIDE",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCK = "BLOCK",
}

export interface IAuthProviders {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: Role;
  address?: string;
  picture?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVarified?: string;
  auths: IAuthProviders[];
  booking?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
