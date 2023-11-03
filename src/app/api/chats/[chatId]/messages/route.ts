import { db } from "@/src/lib/drizzle";
import { chats, messages } from "@/src/lib/drizzle/schema";
import { pusherServer } from "@/src/lib/pusher/server";
import { handleError, toPusherKey } from "@/src/lib/utils";
import { ChatContext, chatContextSchema } from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: ChatContext) {
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

        const chat = await db.query.chats.findFirst({
            where: eq(chats.id, chatId),
            with: {
                messages: true,
            },
        });
        if (!chat)
            return NextResponse.json({
                code: 404,
                message: "Chat not found!",
            });

        await pusherServer.trigger(
            toPusherKey(`chat:${chatId}`),
            "message_seen",
            { receiverId: user.id }
        );

        await db
            .update(messages)
            .set({
                status: "seen",
                seenAt: new Date(),
            })
            .where(
                and(
                    eq(messages.chatId, chatId),
                    eq(messages.receiverId, user.id),
                    eq(messages.status, "sent")
                )
            );

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
