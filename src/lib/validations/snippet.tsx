import z from "zod";

export const snippetMetaSchema = z.object({
    name: z.string("Name is required").min(1, "Name cannot be empty"),
    language: z
        .string("Language is required")
        .min(1, "Language cannot be empty"),
});

export type SnippetMeta = z.infer<typeof snippetMetaSchema>;
