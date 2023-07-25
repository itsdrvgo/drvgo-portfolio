import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(100)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
        ),
});

export const signupSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(100)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
        ),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .regex(/^\S*$/, "Username must not contain spaces"),
});

export const verfifyEmailSchema = z.object({
    code: z
        .string()
        .min(6, "Verification code must be 6 characters long")
        .max(6),
});

export const checkEmailSchema = z.object({
    email: loginSchema.shape.email,
});

export const checkUsernameSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .regex(/^\S*$/, "Username must not contain spaces"),
});

export const resetPasswordSchema = z
    .object({
        password: loginSchema.shape.password,
        confirmPassword: loginSchema.shape.password,
        code: verfifyEmailSchema.shape.code,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const oauthSchema = z.object({
    code: z.enum(["google", "discord", "github"]),
});

export type LoginData = z.infer<typeof loginSchema>;
export type SignUpData = z.infer<typeof signupSchema>;
export type OAuthData = z.infer<typeof oauthSchema>;
