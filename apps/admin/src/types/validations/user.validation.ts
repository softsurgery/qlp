import { z } from "zod";

export const createUserSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().optional(),
    roleId: z.string().min(1, "Role is required"),
    dateOfBirth: z.union([z.string(), z.date()]).optional().nullable(),
    pictureId: z.number().optional(),
  })
  .refine(
    (data) => !data.confirmPassword || data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export const updateUserSchema = (requirePassword: boolean) =>
  z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email("Invalid email"),
      username: z.string().min(3, "Username must be at least 3 characters"),
      password: requirePassword
        ? z.string().min(6, "Password must be at least 6 characters")
        : z.string().optional(),
      confirmPassword: z.string().optional(),
      roleId: z.string().min(1, "Role is required"),
      dateOfBirth: z.union([z.string(), z.date()]).optional().nullable(),
      pictureId: z.number().optional(),
    })
    .refine(
      (data) =>
        !requirePassword ||
        !data.confirmPassword ||
        data.password === data.confirmPassword,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      },
    );
