import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signUpProfileSchema = z.object({
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
});

export const signUpAccountSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
});

export const signUpPasswordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
  });

export const signUpSchema = signUpProfileSchema
  .merge(signUpAccountSchema)
  .merge(
    z.object({
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
