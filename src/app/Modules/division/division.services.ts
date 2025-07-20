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

export const DivisionServices = {
  createUser,
};
