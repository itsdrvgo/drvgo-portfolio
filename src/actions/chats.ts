"use server";

import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../lib/drizzle";
import { chats, messages } from "../lib/drizzle/schema";
import { pusherServer } from "../lib/pusher/server";
import { toPusherKey } from "../lib/utils";
import { Message } from "../lib/validation/messages";
import { ClerkUserWithoutEmail } from "../lib/validation/user";
import { ChatWithExtendedMessages } from "../types";

const messageQueue: {
    [key: string]: Omit<Message, "seenAt" | "editedAt">[];
} = {};

export async function getChat({
    chatId,
    user,
}: {
    chatId: string;
    user: ClerkUserWithoutEmail;
}) {
    const [userId1, userId2] = chatId.split("--");
    if (![userId1, userId2].includes(user.id))
        throw new Error("You are not authorized to view this chat!");

    const friendId = user.id === userId1 ? userId2 : userId1;

    const existingChat = await db.query.chats.findFirst({
        where: eq(chats.id, chatId),
        with: {
            messages: {
                orderBy: [desc(messages.sentAt)],
            },
        },
    });

    let chat: ChatWithExtendedMessages;

    if (existingChat) chat = existingChat;
    else {
        await db.insert(chats).values({
            id: chatId,
            receiverId: friendId,
            senderId: user.id,
        });

        chat = {
            id: chatId,
            receiverId: friendId,
            senderId: user.id,
            messages: [],
        };
    }

    return {
        chat,
    };
}

export async function sendMessage({
    chatId,
    user,
    content,
}: {
    chatId: string;
    user: ClerkUserWithoutEmail;
    content: string;
}) {
    const [userId1, userId2] = chatId.split("--");
    if (![userId1, userId2].includes(user.id))
        throw new Error("You are not authorized to view this chat!");

    const friendId = user.id === userId1 ? userId2 : userId1;
    const messageId = nanoid();

    const message: Omit<Message, "seenAt" | "editedAt"> = {
        id: messageId,
        senderId: user.id,
        text: content,
        status: "sent",
        chatId,
        receiverId: friendId,
        sentAt: new Date(),
    };

    if (!messageQueue[chatId]) messageQueue[chatId] = [message];
    else messageQueue[chatId].push(message);

    if (messageQueue[chatId].length > 3)
        throw new Error("Too many requests, go slower!");

    await pusherServer.trigger(
        toPusherKey(`chat:${chatId}`),
        "incoming_message",
        message
    );

    await db.insert(messages).values({
        id: messageId,
        senderId: user.id,
        text: content,
        status: "sent",
        chatId,
        receiverId: friendId,
    });

    messageQueue[chatId].shift();

    return {
        message,
    };
}

export async function markMessageAsSeen({
    chatId,
    user,
}: {
    chatId: string;
    user: ClerkUserWithoutEmail;
}) {
    await pusherServer.trigger(toPusherKey(`chat:${chatId}`), "message_seen", {
        receiverId: user.id,
    });

    await db
        .update(messages)
        .set({
            seenAt: new Date(),
            status: "seen",
        })
        .where(
            and(
                eq(messages.chatId, chatId),
                eq(messages.receiverId, user.id),
                eq(messages.status, "sent")
            )
        );

    return {
        chatId,
    };
}
