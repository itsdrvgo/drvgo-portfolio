import z from "zod";

export const blogAuthorSchema = z.object({
    name: z.string("Name is required").min(1, "Name cannot be empty"),
    image: z.url("Image must be a valid URL").optional(),
    url: z.url("URL must be a valid URL").optional(),
});

export const blogMetaSchema = z.object({
    title: z.string("Title is required").min(1, "Title cannot be empty"),
    description: z
        .string("Description is required")
        .min(1, "Description cannot be empty"),
    tags: z
        .array(z.string().min(1, "Tags must be at least 1 character long"))
        .min(1, "At least one tag is required"),
    authors: z
        .array(blogAuthorSchema)
        .min(1, "At least one author is required"),
    thumbnail: z.url("Thumbnail must be a valid URL"),
    keywords: z.array(
        z.string().min(1, "Keywords must be at least 1 character long")
    ),
    date: z.date(),
});

export const blogSchema = z.object({
    meta: blogMetaSchema,
    slug: z.string("Slug is required").min(1, "Slug cannot be empty"),
    content: z.string("Content is required").min(1, "Content cannot be empty"),
});

export type BlogMeta = z.infer<typeof blogMetaSchema>;
export type BlogAuthor = z.infer<typeof blogAuthorSchema>;
export type Blog = z.infer<typeof blogSchema>;
