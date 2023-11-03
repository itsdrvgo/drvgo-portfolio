import { db } from "@/src/lib/drizzle";
import { messages } from "@/src/lib/drizzle/schema";
import { pusherServer } from "@/src/lib/pusher/server";
import { handleError, toPusherKey } from "@/src/lib/utils";
import { Message, newMessageValidator } from "@/src/lib/validation/messages";
import { ChatContext, chatContextSchema } from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

const messageQueue: {
    [key: string]: Omit<Message, "seenAt" | "editedAt">[];
} = {};

export async function POST(req: NextRequest, context: ChatContext) {
    try {
        const body = await req.json();

        const { params } = chatContextSchema.parse(context);
        const { chatId } = params;

        const { text } = newMessageValidator.parse(body);

        const user = await currentUser();
        if (!user)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized!",
            });

        const [userId1, userId2] = chatId.split("--");
        if (![userId1, userId2].includes(user.id))
            return NextResponse.json({
                code: 403,
                message: "Forbidden!",
            });

        const friendId = user.id === userId1 ? userId2 : userId1;

        const messageId = nanoid();

        const message: Omit<Message, "seenAt" | "editedAt"> = {
            id: messageId,
            senderId: user.id,
            text,
            status: "sent",
            chatId,
            receiverId: friendId,
            sentAt: new Date(),
        };

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

        await db.insert(messages).values({
            id: messageId,
            senderId: user.id,
            text,
            status: "sent",
            chatId,
            receiverId: friendId,
        });

        messageQueue[chatId].shift();

        return NextResponse.json({
            code: 201,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
