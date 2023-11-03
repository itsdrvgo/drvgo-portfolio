import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
    imageUrl: z.string().url(),
    lastSignInAt: z.number().nullable(),
    username: z.string().nullable(),
    privateMetadata: z.object({
        roles: z.array(z.string()),
        permissions: z.number(),
        strikes: z.number(),
    }),
    emailAddresses: z.array(
        z.object({
            id: z.string(),
            emailAddress: z.string().email(),
        })
    ),
});

export type ClerkUser = z.infer<typeof userSchema>;
export type ClerkUserWithoutEmail = Omit<ClerkUser, "emailAddresses">;
