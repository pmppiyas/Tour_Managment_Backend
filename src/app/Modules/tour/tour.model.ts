import mongoose, { Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TourType = mongoose.model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: [String] },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: Number,
    startDate: Date,
    endDate: Date,
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: Number,
    minAge: Number,
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Tour = mongoose.model<ITour>("Tour", tourSchema);
