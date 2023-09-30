import { z } from "zod";

export const roleCreateSchema = z.object({
    name: z.string().min(2, "Role name must be at least 2 characters long"),
    permissions: z.array(z.string()),
});

export const rolePatchSchema = z.object({
    name: roleCreateSchema.shape.name.optional(),
    permissions: roleCreateSchema.shape.permissions.optional(),
});

export type RoleCreateData = z.infer<typeof roleCreateSchema>;
export type RolePatchData = z.infer<typeof rolePatchSchema>;
