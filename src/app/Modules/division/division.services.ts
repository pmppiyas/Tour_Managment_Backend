import { AppError } from "../../Error/appError";
import { IDivision } from "./division.interfaces";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";
const createUser = async (payload: Partial<IDivision>) => {
  const isExist = await Division.findOne({ name: payload.name });
  if (isExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A division with this name already exists."
    );
  }
  if (payload.name) {
    const baseSlug = payload.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    payload.slug = slug;
  }

  const division = await Division.create(payload);
  return division;
};

const getAllDivisions = async () => {
  const divisions = await Division.find({});
  const totalDivision = await Division.countDocuments();

  return {
    data: divisions,
    meta: {
      total: totalDivision,
    },
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  return {
    data: division,
  };
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const isExist = await Division.findById(id);
  if (!isExist) {
    throw new Error("Division not found.");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new Error("A division with this name already exists.");
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedDivision;
};

export const DivisionServices = {
  createUser,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
};
