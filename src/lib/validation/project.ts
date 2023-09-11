import { z } from "zod";

export const projectCreateSchema = z.object({
    name: z
        .string()
        .min(3, "Project name must be at least 3 characters long")
        .max(20, "Project name must be at most 20 characters long"),
    description: z
        .string()
        .max(20, "Project description must be at most 20 characters long")
        .optional(),
    requirements: z
        .string()
        .min(3, "Project requirements must be at least 3 characters long"),
});

export type ProjectCreateData = z.infer<typeof projectCreateSchema>;
