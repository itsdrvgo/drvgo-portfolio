import { z } from "zod";

export const blogAuthorSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1, "Name must be at least 1 character long"),
    image: z
        .string({
            required_error: "Image is required",
            invalid_type_error: "Image must be a string",
        })
        .url("Image must be a valid URL")
        .optional(),
    url: z
        .string({
            required_error: "URL is required",
            invalid_type_error: "URL must be a string",
        })
        .url("URL must be a valid URL")
        .optional(),
});

export const blogMetaSchema = z.object({
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string",
        })
        .min(1, "Title must be at least 1 character long"),
    description: z
        .string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        })
        .min(1, "Description must be at least 1 character long"),
    tags: z
        .array(
            z
                .string({
                    required_error: "Tags are required",
                    invalid_type_error: "Tags must be a string",
                })
                .min(1, "Tags must be at least 1 character long")
        )
        .min(1, "At least one tag is required"),
    authors: z
        .array(blogAuthorSchema)
        .min(1, "At least one author is required"),
    thumbnail: z
        .string({
            required_error: "Thumbnail is required",
            invalid_type_error: "Thumbnail must be a string",
        })
        .url("Thumbnail must be a valid URL"),
    keywords: z.array(
        z
            .string({
                required_error: "Keywords are required",
                invalid_type_error: "Keywords must be a string",
            })
            .min(1, "Keywords must be at least 1 character long")
    ),
    date: z.date({
        required_error: "Date is required",
        invalid_type_error: "Date must be a date",
    }),
});

export const blogSchema = z.object({
    meta: blogMetaSchema,
    slug: z
        .string({
            required_error: "Slug is required",
            invalid_type_error: "Slug must be a string",
        })
        .min(1, "Slug must be at least 1 character long"),
    content: z
        .string({
            required_error: "Content is required",
            invalid_type_error: "Content must be a string",
        })
        .min(1, "Content must be at least 1 character long"),
});

export type BlogMeta = z.infer<typeof blogMetaSchema>;
export type BlogAuthor = z.infer<typeof blogAuthorSchema>;
export type Blog = z.infer<typeof blogSchema>;
