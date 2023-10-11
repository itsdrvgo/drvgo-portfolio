import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { comments } from "@/src/lib/drizzle/schema";
import { addNotification } from "@/src/lib/notifications";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import {
    CommentContext,
    commentContextSchema,
} from "@/src/lib/validation/route";
import { and, eq } from "drizzle-orm";
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

        const comment = await db.query.comments.findFirst({
            where: eq(comments.id, params.commentId),
            with: {
                blog: true,
            },
        });
        if (!comment)
            return NextResponse.json({
                code: 404,
                message: "Comment not found!",
            });

        const existingPin = await db.query.comments.findFirst({
            where: and(
                eq(comments.pinned, true),
                eq(comments.blogId, params.blogId)
            ),
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

        addNotification({
            userId: comment.authorId,
            notifierId: user.id,
            title: "Comment Pinned",
            content: `Your comment on '${comment.blog.title}' has been pinned`,
            props: {
                type: "blogCommentPin",
                blogId: comment.blogId,
                commentId: comment.id,
                blogThumbnailUrl: comment.blog.thumbnailUrl!,
                commentContent: comment.content,
            },
            type: "blogCommentPin",
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
