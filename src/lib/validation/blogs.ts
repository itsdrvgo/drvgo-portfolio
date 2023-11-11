import { z } from "zod";

export const blogTitleSchema = z
    .string()
    .min(1, "Title must have at least 1 characters")
    .max(128, "Title cannot exceed 128 characters");

export const blogDescriptionSchema = z
    .string()
    .min(1, "Description must have at least 1 characters")
    .max(150, "Description cannot exceed 150 characters");

export const blogContentSchema = z
    .string()
    .min(1, "Content must have at least 1 characters");

export const blogThumbnailSchema = z
    .string({ invalid_type_error: "Thumbnail cannot be empty" })
    .url();

export const blogPrivacySchema = z.object({
    published: z.boolean(),
});

export const blogUpdateSchema = z.object({
    title: blogTitleSchema.optional(),
    description: blogDescriptionSchema.optional(),
    content: blogContentSchema.optional(),
    thumbnailUrl: blogThumbnailSchema.nullable(),
});

export const blogPublishSchema = z.object({
    title: blogTitleSchema,
    description: blogDescriptionSchema,
    content: blogContentSchema,
    thumbnailUrl: blogThumbnailSchema,
});

export type BlogUpdateData = z.infer<typeof blogUpdateSchema>;
export type BlogPublishData = z.infer<typeof blogPublishSchema>;
