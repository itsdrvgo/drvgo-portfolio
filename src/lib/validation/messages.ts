import { z } from "zod";

export const messageValidator = z.object({
    id: z.string(),
    chatId: z.string(),
    senderId: z.string(),
    receiverId: z.string(),
    status: z
        .enum(["pending", "sent", "seen", "edited", "deleted", "failed"])
        .default("pending"),
    sentAt: z.date(),
    seenAt: z.date().optional().nullable(),
    editedAt: z.date().optional().nullable(),
    text: z.string(),
});

export const updateMessageValidator = z.object({
    text: z.string().optional(),
    chatId: z.string(),
});

export const messageArrayValidator = z.array(messageValidator);

export const newMessageValidator = z.object({
    text: z.string(),
});

export type Message = z.infer<typeof messageValidator>;
export type NewMessage = z.infer<typeof newMessageValidator>;
export type UpdateMessage = z.infer<typeof updateMessageValidator>;
