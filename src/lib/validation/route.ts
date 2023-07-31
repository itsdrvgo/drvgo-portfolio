import { z } from "zod";

export const userContextSchema = z.object({
    params: z.object({
        userId: z.string(),
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

export type UserContext = z.infer<typeof userContextSchema>;
export type BlogContext = z.infer<typeof blogContextSchema>;
export type CommentContext = z.infer<typeof commentContextSchema>;
