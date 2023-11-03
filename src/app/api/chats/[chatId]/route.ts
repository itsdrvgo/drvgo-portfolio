import { db } from "@/src/lib/drizzle";
import { chats, messages } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { ChatContext, chatContextSchema } from "@/src/lib/validation/route";
import { ChatWithExtendedMessages } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: ChatContext) {
    try {
        const { params } = chatContextSchema.parse(context);
        const { chatId } = params;

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

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(chat),
        });
    } catch (err) {
        return handleError(err);
    }
}
