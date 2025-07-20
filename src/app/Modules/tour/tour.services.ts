import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

const createTour = async (payload: ITour) => {
  const isExistTour = await Tour.findOne({ name: payload.name });
  if (isExistTour) {
    throw new Error("A tour with this name already exists.");
  }

  if (payload.name) {
    const baseSlug = payload.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    payload.slug = slug;
  }
  const tour = await Tour.create(payload);
  return tour;
};

export const TourServices = {
  createTour,
};
