import { z } from "zod";

export const messageValidator = z.object({
    id: z.string(),
    senderId: z.string(),
    text: z.string(),
    timestamp: z.number(),
});

export const updateMessageValidator = z.object({
    text: z.string().optional(),
    chatId: z.string(),
});

export const messageArrayValidator = z.array(messageValidator);

export const newMessageValidator = z.object({
    text: z.string(),
    chatId: z.string(),
});

export type Message = z.infer<typeof messageValidator>;
export type NewMessage = z.infer<typeof newMessageValidator>;
export type UpdateMessage = z.infer<typeof updateMessageValidator>;
