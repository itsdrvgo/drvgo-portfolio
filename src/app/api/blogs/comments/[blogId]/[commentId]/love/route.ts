import { db } from "@/src/lib/drizzle";
import { commentLoves } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import {
    CommentContext,
    commentContextSchema,
} from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: CommentContext) {
    try {
        const { params } = commentContextSchema.parse(context);

        const user = await currentUser();
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const loveId = nanoid();

        await db.insert(commentLoves).values({
            id: loveId,
            userId: user.id,
            commentId: params.commentId,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(loveId),
        });
    } catch (err) {
        return handleError(err);
    }
}
