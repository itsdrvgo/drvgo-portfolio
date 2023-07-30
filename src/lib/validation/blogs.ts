import { z } from "zod";

export const blogCreateSchema = z.object({
    title: z.string(),
    content: z.string().optional(),
    thumbnailUrl: z.string().optional(),
});

export const postPatchSchema = z.object({
    title: z
        .string()
        .min(3, "Title must have at least 3 characters")
        .max(128, "Title cannot exceed 128 characters")
        .optional(),
    content: z.string().optional().nullable(),
    thumbnailUrl: z.string().url().nullable(),
    published: z.boolean().default(false),
    action: z.enum(["edit", "publish"]),
});

export const publishSchema = z.object({
    title: z
        .string()
        .min(3, "Title must have at least 3 characters")
        .max(128, "Title cannot exceed 128 characters"),
    content: z.string().min(10, "Content must have at least 10 characters"),
    thumbnailUrl: z
        .string({ invalid_type_error: "Thumbnail cannot be empty" })
        .url(),
    published: z.boolean().default(false),
});

export const likeUpdateSchema = z.object({
    userId: z.string(),
    isLiked: z.boolean(),
});

export type BlogCreateData = z.infer<typeof blogCreateSchema>;
export type BlogPatchData = z.infer<typeof postPatchSchema>;
export type BlogPublishData = z.infer<typeof publishSchema>;
export type LikeUpdateData = z.infer<typeof likeUpdateSchema>;
