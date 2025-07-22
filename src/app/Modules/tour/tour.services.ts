import httpsStatus from "http-status-codes";
import { AppError } from "../../Error/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { tourSearchableFields } from "./tour.constant";

///-----Tour-----////

const createTour = async (payload: ITour) => {
  const isExistTour = await Tour.findOne({ name: payload.name });
  if (isExistTour) {
    throw new Error("A tour with this name already exists.");
  }

  const tour = await Tour.create(payload);
  return tour;
};

const getAllTour = async (query: Record<string, string>) => {
  const searchTerm = query.searchTerm || "";
  const sort = query.sort || "-createdAt";
  const fields = query.fields?.split(",").join(" ") || "";
  const page = query.page || "1";
  const limit = query.limit || "10";
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {};

  if (searchTerm) {
    filter.$or = tourSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    }));
  }
  if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
  }
  const tours = await Tour.find(filter)
    .sort(sort)
    .select(fields)
    .skip(skip)
    .limit(Number(limit));

  if (!tours || tours.length === 0) {
    throw new AppError(httpsStatus.NOT_FOUND, "No tours found.");
  }

  const totalDocuments = await Tour.countDocuments();
  const totalIndex = tours.length;
  if (totalIndex === 0) {
    throw new AppError(httpsStatus.NOT_FOUND, "No tours found.");
  }
  const totalPage = Math.ceil(totalDocuments / Number(limit));
  const meta = {
    totalDocuments,
    totalIndex,
    totalPage,
    page: Number(page),
    limit: Number(limit),
  };
  return {
    tours,
    query,
    meta,
  };
};

const getSingleTour = async (id: string) => {
  const tour = await Tour.findById(id);
  if (!tour) {
    throw new Error("Tour not found.");
  }
  return tour;
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const isExistTour = await Tour.findById(id);
  if (!isExistTour) {
    throw new Error("Tour not found.");
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedTour;
};

const tourDelete = async (id: string) => {
  const isExistTour = await Tour.findById(id);
  if (!isExistTour) {
    throw new Error("Tour not found.");
  }

  await Tour.findByIdAndDelete(id);
  return null;
};

///-----Tour Type-----////

const createTourType = async (payload: ITourType) => {
  const isExistTourType = await TourType.findOne({ name: payload.name });
  if (isExistTourType) {
    throw new Error("A tour type with this name already exists.");
  }

  const tourType = await TourType.create(payload);
  return tourType;
};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const isExistTourType = await TourType.findById(id);
  if (!isExistTourType) {
    throw new Error("Tour type not found.");
  }
  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedTourType;
};

const getAllTourTypes = async () => {
  return await TourType.find();
};

const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourType.findByIdAndDelete(id);
};
export const TourServices = {
  createTour,
  getAllTour,
  getSingleTour,
  updateTour,
  tourDelete,

  // ----Tour Type----//

  createTourType,
  updateTourType,
  getAllTourTypes,
  deleteTourType,
};
