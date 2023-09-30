import { redis } from "@/src/lib/redis";
import { handleError } from "@/src/lib/utils";
import { updateMessageValidator } from "@/src/lib/validation/messages";
import {
    MessageContext,
    messageContextSchema,
} from "@/src/lib/validation/route";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: MessageContext) {
    try {
        const body = await req.json();

        const { params } = messageContextSchema.parse(context);
        const { messageId } = params;

        const { text, chatId } = updateMessageValidator.parse(body);

        const updatedMessageScore = await redis.zrank(
            `chat:${chatId}:messages`,
            messageId
        );

        if (!updatedMessageScore)
            return NextResponse.json({
                code: 404,
                message: "Message not found!",
            });

        await redis.zadd(`chat:${chatId}:messages`, {
            score: updatedMessageScore,
            member: JSON.stringify({
                id: messageId,
                text,
            }),
        });

        return NextResponse.json({
            code: 200,
            message: "Message updated",
        });
    } catch (err) {
        return handleError(err);
    }
}
