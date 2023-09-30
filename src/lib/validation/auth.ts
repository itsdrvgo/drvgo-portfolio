import { z } from "zod";

// SHAPES

export const checkEmailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export const checkUsernameSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be at most 20 characters long")
        .regex(/^\S*$/, "Username must not contain spaces"),
});

// SCHEMAS

export const loginSchema = z.object({
    email: checkEmailSchema.shape.email,
});

export const signupSchema = z.object({
    email: checkEmailSchema.shape.email,
    username: checkUsernameSchema.shape.username,
});

export const userUpdateSchema = z.object({
    email: checkEmailSchema.shape.email.optional(),
    username: checkUsernameSchema.shape.username.optional(),
    roles: z.array(z.string()).optional(),
    strikes: z.number().optional(),
});

// TYPES

export type UsernameData = z.infer<typeof checkUsernameSchema>;
export type EmailData = z.infer<typeof checkEmailSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignUpData = z.infer<typeof signupSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
