import mongoose, { Schema } from "mongoose";
import { IDivision } from "./division.interfaces";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    thumbnail: {
      type: [String],
      default: [],
    },

    description: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Division = mongoose.model<IDivision>("Devision", divisionSchema);
