import { db } from "@/src/lib/drizzle";
import { comments, users } from "@/src/lib/drizzle/schema";
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

        if (!["owner", "admin"].includes(user.role))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const existingPin = await db.query.comments.findFirst({
            where: eq(comments.pinned, true),
        });

        if (existingPin) {
            await db
                .update(comments)
                .set({
                    pinned: false,
                })
                .where(eq(comments.id, existingPin.id));
        }

        await db
            .update(comments)
            .set({
                pinned: true,
            })
            .where(eq(comments.id, params.commentId));

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        handleError(err);
    }
}
