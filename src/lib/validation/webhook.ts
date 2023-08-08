import { z } from "zod";

export const webhookSchema = z.object({
    data: z.any(),
    object: z.literal("event"),
    type: z.enum(["user.created", "user.updated", "user.deleted"]),
});

export const userWebhookSchema = z.object({
    id: z.string(),
    username: z.string().nullable(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    profile_image_url: z.string().nullable(),
    created_at: z.number(),
    email_addresses: z.array(
        z.object({
            email_address: z.string().email(),
        })
    ),
    private_metadata: z.object({
        role: z
            .enum(["user", "moderator", "admin", "owner"])
            .default("user")
            .optional(),
    }),
});

export const userDeleteWebhookSchema = z.object({
    id: z.string(),
    delete: z.boolean().optional(),
    object: z.string(),
});

export const roleUpdateSchema = z.object({
    role: z.enum(["user", "moderator", "admin", "owner"]),
    userId: z.string(),
    action: z.enum(["promote", "demote"]).optional(),
});

export const userDeleteSchema = z.object({
    id: z.string(),
});

export type WebhookData = z.infer<typeof webhookSchema>;
export type UserWebhookData = z.infer<typeof userWebhookSchema>;
export type UserDeleteWebhookData = z.infer<typeof userDeleteWebhookSchema>;
export type UserRoleUpdateData = z.infer<typeof roleUpdateSchema>;
export type UserDeleteData = z.infer<typeof userDeleteSchema>;
