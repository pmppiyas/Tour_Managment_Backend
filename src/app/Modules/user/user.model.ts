import mongoose, { Schema, Types } from "mongoose";
import { IAuthProviders, IsActive, IUser, Role } from "./user.interface";

const AuthSchema = new Schema<IAuthProviders>(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: String,
    phone: String,
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    picture: String,
    address: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVarified: {
      type: Boolean,
      default: false,
    },
    auths: [AuthSchema],
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
