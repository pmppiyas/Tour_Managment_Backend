import { AppError } from "../../Error/appError";
import { IDivision } from "./division.interfaces";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";

const createDivision = async (payload: Partial<IDivision>) => {
  const isExist = await Division.findOne({ name: payload.name });
  if (isExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A division with this name already exists."
    );
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

const deleteDivision = async (id: string) => {
  const isExist = await Division.findById(id);
  if (!isExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Division is not found by this ID!"
    );
  }

  await Division.findByIdAndDelete(id);

  return null;
};

export const DivisionServices = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
