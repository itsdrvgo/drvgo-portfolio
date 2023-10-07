import { pusherServer } from "@/src/lib/pusher/server";
import { redis } from "@/src/lib/redis";
import { handleError, toPusherKey } from "@/src/lib/utils";
import {
    Message,
    messageValidator,
    newMessageValidator,
} from "@/src/lib/validation/messages";
import { currentUser } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

const messageQueue: { [key: string]: Message[] } = {};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { chatId, text } = newMessageValidator.parse(body);

        const user = await currentUser();
        if (!user)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized!",
            });

        const [userId1, userId2] = chatId.split("--");
        if (![userId1, userId2].includes(user.id))
            return NextResponse.json({
                code: 401,
                message: "Unauthorized!",
            });

        const friendId = user.id === userId1 ? userId2 : userId1;

        const timestamp = Date.now();

        const messageData: Message = {
            id: nanoid(),
            senderId: user.id,
            text,
            timestamp,
        };

        const message = messageValidator.parse(messageData);

        if (!messageQueue[chatId]) messageQueue[chatId] = [message];
        else messageQueue[chatId].push(message);

        if (messageQueue[chatId].length > 3)
            return NextResponse.json({
                code: 429,
                message: "Too many requests, go slower!",
            });

        await pusherServer.trigger(
            toPusherKey(`chat:${chatId}`),
            "incoming_message",
            message
        );

        await pusherServer.trigger(
            toPusherKey(`user:${friendId}:chats`),
            "new_message",
            {
                ...message,
                senderImg: user.imageUrl,
                senderUsername: user.username,
            }
        );

        await redis.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(message),
        });

        messageQueue[chatId].shift();

        return NextResponse.json({
            code: 201,
            message: "Message sent",
        });
    } catch (err) {
        return handleError(err);
    }
}
