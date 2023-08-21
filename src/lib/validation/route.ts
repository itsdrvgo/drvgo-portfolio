import { z } from "zod";

export const userContextSchema = z.object({
    params: z.object({
        userId: z.string(),
    }),
});

export const accountsContextSchema = z.object({
    params: z.object({
        accountId: z.string(),
    }),
});

export const blogContextSchema = z.object({
    params: z.object({
        blogId: z.string(),
    }),
});

export const commentContextSchema = z.object({
    params: z.object({
        blogId: z.string(),
        commentId: z.string(),
    }),
});

export const usernameContextSchema = z.object({
    params: z.object({
        username: z.string(),
    }),
});

export type UserContext = z.infer<typeof userContextSchema>;
export type AccountContext = z.infer<typeof accountsContextSchema>;
export type BlogContext = z.infer<typeof blogContextSchema>;
export type CommentContext = z.infer<typeof commentContextSchema>;
export type UsernameContext = z.infer<typeof usernameContextSchema>;
