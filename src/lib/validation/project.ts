import { z } from "zod";

export const projectName = z
    .string()
    .min(3, "Project name must be at least 3 characters long")
    .max(100, "Project name must be at most 100 characters long");

export const projectDescription = z
    .string()
    .min(3, "Project description must be at least 3 characters long")
    .max(450, "Project description must be at most 450 characters long");

export const projectRequirements = z
    .string()
    .min(3, "Project requirements must be at least 3 characters long");

export const projectPrice = z.number().min(0, "Project price must be positive");
export const projectDeadline = z.string();
export const projectRejectedReason = z.string();

export const projectCreateSchema = z.object({
    name: projectName,
    description: projectDescription,
    requirements: projectRequirements,
});

export const projectUpdateSchema = z.object({
    name: projectName.optional(),
    description: projectDescription.optional(),
    requirements: projectRequirements.optional(),
    price: projectPrice.optional(),
    deadline: projectDeadline.optional(),
    rejectedReason: projectRejectedReason.optional(),
});

export type ProjectCreateData = z.infer<typeof projectCreateSchema>;
export type ProjecUpdatehData = z.infer<typeof projectUpdateSchema>;
