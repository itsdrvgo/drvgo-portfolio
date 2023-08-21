import { z } from "zod";

export const blogCreateSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    content: z.string().optional(),
    thumbnailUrl: z.string().optional(),
});

export const publishSchema = z.object({
    title: z
        .string()
        .min(3, "Title must have at least 3 characters")
        .max(128, "Title cannot exceed 128 characters"),
    description: z
        .string()
        .min(10, "Description must have at least 10 characters")
        .max(150, "Description cannot exceed 150 characters"),
    content: z.string().min(10, "Content must have at least 10 characters"),
    thumbnailUrl: z
        .string({ invalid_type_error: "Thumbnail cannot be empty" })
        .url(),
    published: z.boolean().default(false),
});

export const postPatchSchema = z.object({
    title: publishSchema.shape.title.optional(),
    description: publishSchema.shape.description.optional(),
    content: publishSchema.shape.content.optional().nullable(),
    thumbnailUrl: publishSchema.shape.thumbnailUrl.nullable(),
    published: publishSchema.shape.published,
    action: z.enum(["edit", "publish"]),
});

export const likeUpdateSchema = z.object({
    isLiked: z.boolean(),
});

export type BlogCreateData = z.infer<typeof blogCreateSchema>;
export type BlogPatchData = z.infer<typeof postPatchSchema>;
export type BlogPublishData = z.infer<typeof publishSchema>;
export type LikeUpdateData = z.infer<typeof likeUpdateSchema>;
