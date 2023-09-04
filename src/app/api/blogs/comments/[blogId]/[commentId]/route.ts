import { db } from "@/src/lib/drizzle";
import {
    commentLoves,
    comments,
    insertCommentSchema,
} from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import {
    CommentContext,
    commentContextSchema,
} from "@/src/lib/validation/route";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const replySchema = insertCommentSchema.pick({ content: true });
const commentEditSchema = insertCommentSchema.pick({ content: true });

export async function DELETE(req: NextRequest, context: CommentContext) {
    try {
        const { params } = commentContextSchema.parse(context);

        const user = await getAuthorizedUser();
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const comment = await db.query.comments.findFirst({
            where: eq(comments.id, params.commentId),
        });

        if (!comment)
            return NextResponse.json({
                code: 404,
                message: "Comment not found",
            });

        if (comment.parentId === null) {
            const [allReplies] = await Promise.all([
                // Finding all the child/replies of the comment
                db.query.comments.findMany({
                    where: eq(comments.parentId, params.commentId),
                }),
                // Deleting the root comment
                db.delete(comments).where(eq(comments.id, params.commentId)),
                // Deleting all the replies
                db
                    .delete(comments)
                    .where(eq(comments.parentId, params.commentId)),
                // Deleting all the comment loves of the root comment
                db
                    .delete(commentLoves)
                    .where(eq(commentLoves.commentId, params.commentId)),
            ]);

            await Promise.all(
                // Deleting all the comment loves of the replies
                allReplies.map((reply) =>
                    db
                        .delete(commentLoves)
                        .where(eq(commentLoves.commentId, reply.id))
                )
            );
        } else {
            await Promise.all([
                db.delete(comments).where(eq(comments.id, params.commentId)),
                db
                    .delete(commentLoves)
                    .where(and(eq(commentLoves.commentId, params.commentId))),
            ]);
        }

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        handleError(err);
    }
}

export async function POST(req: NextRequest, context: CommentContext) {
    try {
        const body = await req.json();

        const { params } = commentContextSchema.parse(context);
        const { content } = replySchema.parse(body);

        const user = await getAuthorizedUser();
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const replyId = crypto.randomUUID();

        await db.insert(comments).values({
            id: replyId,
            authorId: user.id,
            blogId: params.blogId,
            content,
            parentId: params.commentId,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(replyId),
        });
    } catch (err) {
        handleError(err);
    }
}

export async function PATCH(req: NextRequest, context: CommentContext) {
    try {
        const body = await req.json();

        const { params } = commentContextSchema.parse(context);
        const { content } = commentEditSchema.parse(body);

        const user = await getAuthorizedUser();
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        await db
            .update(comments)
            .set({ content, edited: true })
            .where(eq(comments.id, params.commentId));

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        handleError(err);
    }
}
