import { z } from "zod";

export const snippetMetaSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1, "Name must be at least 1 character long"),
    language: z
        .string({
            required_error: "Language is required",
            invalid_type_error: "Language must be a string",
        })
        .min(1, "Language must be at least 1 character long"),
});

export type SnippetMeta = z.infer<typeof snippetMetaSchema>;
