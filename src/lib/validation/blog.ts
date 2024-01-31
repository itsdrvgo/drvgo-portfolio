import { z } from "zod";

export const blogAuthorSchema = z.object({
    name: z
        .string()
        .min(1, "Name must be at least 1 character long")
        .max(100, "Name must be less than 100 characters long"),
    url: z
        .string()
        .url("Social must be a valid URL (e.g. https://example.com)")
        .optional(),
});

export const blogMetadataSchema = z.object({
    title: z
        .string()
        .min(1, "Title must be at least 1 character long")
        .max(100, "Title must be less than 100 characters long"),
    description: z
        .string()
        .min(1, "Description must be at least 1 character long")
        .max(200, "Description must be less than 200 characters long"),
    tags: z
        .array(
            z
                .string()
                .min(1, "Tag must be at least 1 character long")
                .max(20, "Tag must be less than 20 characters long")
        )
        .min(1, "You must have at least 1 tag")
        .max(10, "You can have at most 10 tags"),
    authors: z
        .array(blogAuthorSchema)
        .min(1, "You must have at least 1 author"),
    date: z
        .date()
        .min(new Date(2000, 0, 1), "Date must be after 2000")
        .max(new Date(), "Date must be before today"),
});

export type BlogMetadata = z.infer<typeof blogMetadataSchema>;
