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

        return NextResponse.json({
            code: 201,
            message: "Message sent",
        });
    } catch (err) {
        return handleError(err);
    }
}
