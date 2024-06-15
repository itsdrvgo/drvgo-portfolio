import { z } from "zod";

export const snippetMetadataSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 character long"),
    language: z.string().min(1, "Language must be at least 1 character long"),
});

export type SnippetMetadata = z.infer<typeof snippetMetadataSchema>;
