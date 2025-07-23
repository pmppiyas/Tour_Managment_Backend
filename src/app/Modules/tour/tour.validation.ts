import { z } from "zod";

export const createTourZodObject = z.object({
  name: z
    .string({ required_error: "Tour name is required." })
    .min(2, "Minimum two charecter needed."),
  slug: z.string().optional(),
  description: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
  location: z.string().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
  costFrom: z.number().optional(),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),

  included: z.array(z.string()).optional().default([]),
  excluded: z.array(z.string()).optional().default([]),
  amenities: z.array(z.string()).optional().default([]),
  tourPlan: z.array(z.string()).optional().default([]),

  maxGuest: z.number().optional(),
  minAge: z.number().optional(),

  division: z.string({ required_error: "Divistion name is required" }),
  tourType: z.string({ required_error: "TourType is required" }),
});

export const tourTypeZodObject = z.object({
  name: z
    .string({ required_error: "Tour type name is required." })
    .min(2, "Minimum two characters needed."),
});
