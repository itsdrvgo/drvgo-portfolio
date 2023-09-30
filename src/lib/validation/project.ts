import { z } from "zod";

export const projectCreateSchema = z.object({
    name: z
        .string()
        .min(3, "Project name must be at least 3 characters long")
        .max(50, "Project name must be at most 50 characters long"),
    description: z
        .string()
        .min(3, "Project description must be at least 3 characters long")
        .max(450, "Project description must be at most 450 characters long"),
    requirements: z
        .string()
        .min(3, "Project requirements must be at least 3 characters long"),
});

export const projectPatchSchema = z.object({
    name: projectCreateSchema.shape.name.optional(),
    description: projectCreateSchema.shape.description.optional(),
    requirements: projectCreateSchema.shape.requirements.optional(),
    price: z.number().optional(),
    deadline: z.string().optional(),
    rejectedReason: z.string().optional(),
});

export type ProjectCreateData = z.infer<typeof projectCreateSchema>;
export type ProjectPatchData = z.infer<typeof projectPatchSchema>;
