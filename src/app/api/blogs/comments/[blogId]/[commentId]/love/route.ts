import { db } from "@/src/lib/drizzle";
import { commentLoves, users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import {
    CommentContext,
    commentContextSchema,
} from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: CommentContext) {
    try {
        const { params } = commentContextSchema.parse(context);

        const authUser = await currentUser();
        if (!authUser)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const user = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
        });
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const newLove = await db.insert(commentLoves).values({
            id: crypto.randomUUID(),
            userId: user.id,
            commentId: params.commentId,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(newLove.insertId),
        });
    } catch (err) {
        handleError(err);
    }
}
