import { z } from "zod";

// SHAPES

export const checkEmailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export const checkPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(100)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
        ),
});

export const checkUsernameSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .regex(/^\S*$/, "Username must not contain spaces"),
});

export const checkIconSchema = z.object({
    icon: z.string().url(),
});

export const verfifyEmailSchema = z.object({
    code: z
        .string()
        .min(6, "Verification code must be 6 characters long")
        .max(6),
});

export const resetPasswordSchema = z
    .object({
        password: checkPasswordSchema.shape.password,
        confirmPassword: checkPasswordSchema.shape.password,
        code: verfifyEmailSchema.shape.code,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

// SCHEMAS

export const loginSchema = z.object({
    email: checkEmailSchema.shape.email,
    password: checkPasswordSchema.shape.password,
});

export const signupSchema = z.object({
    email: checkEmailSchema.shape.email,
    password: checkPasswordSchema.shape.password,
    username: checkUsernameSchema.shape.username,
});

export const userUpdateSchema = z.object({
    email: checkEmailSchema.shape.email.optional(),
    username: checkUsernameSchema.shape.username.optional(),
    icon: checkIconSchema.shape.icon.optional(),
});

export const oauthSchema = z.object({
    code: z.enum(["facebook", "discord", "github"]),
});

// TYPES

export type UsernameData = z.infer<typeof checkUsernameSchema>;
export type EmailData = z.infer<typeof checkEmailSchema>;
export type PasswordData = z.infer<typeof checkPasswordSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignUpData = z.infer<typeof signupSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
export type OAuthData = z.infer<typeof oauthSchema>;
