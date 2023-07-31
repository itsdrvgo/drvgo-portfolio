import { authOptions } from "@/src/lib/auth/auth";
import { db } from "@/src/lib/drizzle";
import { blogs, comments, users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import {
    CommentContext,
    commentContextSchema,
} from "@/src/lib/validation/route";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: CommentContext) {
    try {
        const { params } = commentContextSchema.parse(context);

        const session = await getServerSession(authOptions);
        if (!session)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        await db
            .delete(comments)
            .where(eq(comments.id, Number(params.commentId)));

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        handleError(err);
    }
}
