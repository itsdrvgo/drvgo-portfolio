import { z } from "zod";

export const userContextSchema = z.object({
    params: z.object({
        userId: z.string(),
    }),
});

export const accountsContextSchema = z.object({
    params: z.object({
        accountId: z.string(),
    }),
});

export const blogContextSchema = z.object({
    params: z.object({
        blogId: z.string(),
    }),
});

export const commentContextSchema = z.object({
    params: z.object({
        blogId: z.string(),
        commentId: z.string(),
    }),
});

export const usernameContextSchema = z.object({
    params: z.object({
        username: z.string(),
    }),
});

export const notificationContextSchema = z.object({
    params: z.object({
        userId: z.string(),
        notificationId: z.string(),
    }),
});

export const projectContextSchema = z.object({
    params: z.object({
        projectId: z.string(),
    }),
});

export const messageContextSchema = z.object({
    params: z.object({
        messageId: z.string(),
    }),
});

export const roleContextSchema = z.object({
    params: z.object({
        roleId: z.string(),
    }),
});

export const chatContextSchema = z.object({
    params: z.object({
        chatId: z.string(),
    }),
});

export type UserContext = z.infer<typeof userContextSchema>;
export type AccountContext = z.infer<typeof accountsContextSchema>;
export type BlogContext = z.infer<typeof blogContextSchema>;
export type CommentContext = z.infer<typeof commentContextSchema>;
export type UsernameContext = z.infer<typeof usernameContextSchema>;
export type NotificationContext = z.infer<typeof notificationContextSchema>;
export type ProjectContext = z.infer<typeof projectContextSchema>;
export type MessageContext = z.infer<typeof messageContextSchema>;
export type RoleContext = z.infer<typeof roleContextSchema>;
export type ChatContext = z.infer<typeof chatContextSchema>;
