import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
    imageUrl: z.string().url(),
    lastSignInAt: z.number().nullable(),
    username: z.string().nullable(),
    privateMetadata: z.object({
        role: z.enum(["user", "guest", "moderator", "admin", "owner"]),
    }),
    emailAddresses: z.array(
        z.object({
            id: z.string(),
            emailAddress: z.string().email(),
        })
    ),
});

export type ClerkUser = z.infer<typeof userSchema>;
