import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { comments } from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import {
    CommentContext,
    commentContextSchema,
} from "@/src/lib/validation/route";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: CommentContext) {
    try {
        const { params } = commentContextSchema.parse(context);

        const user = await getAuthorizedUser(
            BitFieldPermissions.ManageBlogs | BitFieldPermissions.ManagePages
        );
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        await db
            .update(comments)
            .set({
                pinned: false,
            })
            .where(eq(comments.id, params.commentId));

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
