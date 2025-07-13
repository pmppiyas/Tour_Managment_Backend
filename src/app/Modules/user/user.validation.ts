import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createZodUser = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name is too short, Minimum 2 charecters long" })
    .max(50, { message: "Name is too long, Max 50 charecter long" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
      message:
        "Password must include uppercase, lowercase, and a special character.",
    }),
  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, {
      message:
        "Number should be a valid bangladeshi number (example: 017xxxxxxxx)",
    })
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 charecters" })
    .optional(),
});

export const updateZodUser = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name is too short, Minimum 2 charecters long" })
    .max(50, { message: "Name is too long, Max 50 charecter long" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
      message:
        "Password must include uppercase, lowercase, and a special character.",
    })
    .optional(),
  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, {
      message:
        "Number should be a valid bangladeshi number (example: 017xxxxxxxx)",
    })
    .optional(),

  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "IsDeleted must be true or false" })
    .optional(),
  isVarified: z
    .boolean({ invalid_type_error: "IsVarified must be true or false" })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 charecters" })
    .optional(),
});
