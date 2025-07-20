import { z } from "zod";

export const createDivisionZodSchema = z.object({
  name: z.string().min(2, "Minimum 2 charecter needed."),
  slug: z.string().min(2, "Minimum 2 charecter needed."),
  thumbnail: z.array(z.string()).optional().default([]),
  description: z.array(z.string()).optional().default([]),
});
