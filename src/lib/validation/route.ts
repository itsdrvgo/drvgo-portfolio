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

export type UserContext = z.infer<typeof userContextSchema>;
export type BlogContext = z.infer<typeof blogContextSchema>;
