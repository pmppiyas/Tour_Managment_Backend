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
    slug: { type: String, unique: true },
    description: { type: [String], default: [] },
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

tourSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    this.slug = slug;
  }
  next();
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as Partial<ITour>;
  if (division.name) {
    const baseSlug = division.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    this.set({ slug });
  }

  next();
});

export const Tour = mongoose.model<ITour>("Tour", tourSchema);
