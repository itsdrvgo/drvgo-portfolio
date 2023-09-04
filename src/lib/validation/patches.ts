import { z } from "zod";

export const patchPublishSchema = z.object({
    major: z.number().int(),
    minor: z.number().int(),
    patch: z.number().int(),
    description: z.string(),
    published: z.boolean(),
});

export const patchPatchSchema = z.object({
    major: z.number().int().optional(),
    minor: z.number().int().optional(),
    patch: z.number().int().optional(),
    description: z.string().optional(),
    published: patchPublishSchema.shape.published,
    action: z.enum(["edit", "publish"]),
});

export type PatchPatchData = z.infer<typeof patchPatchSchema>;
export type PatchPublishData = z.infer<typeof patchPublishSchema>;
