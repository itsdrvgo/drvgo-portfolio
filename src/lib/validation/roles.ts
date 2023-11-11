import { z } from "zod";

export const roleNameSchema = z
    .string()
    .min(2, "Role name must be at least 2 characters long")
    .max(100, "Role name must be less than 100 characters long");

export const rolePermissionsSchema = z.array(z.string());

export const roleUpdateSchema = z.object({
    name: roleNameSchema.optional(),
    permissions: rolePermissionsSchema.optional(),
});

export type RoleUpdateData = z.infer<typeof roleUpdateSchema>;
