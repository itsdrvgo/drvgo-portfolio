import { db } from "@/src/lib/drizzle";
import { commentLoves, comments } from "@/src/lib/drizzle/schema";
import { addNotification, handleError } from "@/src/lib/utils";
import {
    CommentContext,
    commentContextSchema,
} from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: CommentContext) {
    try {
        const { params } = commentContextSchema.parse(context);

        // const user = await currentUser();
        // if (!user)
        //     return NextResponse.json({
        //         code: 403,
        //         message: "Unauthorized!",
        //     });

        const [user, comment] = await Promise.all([
            currentUser(),
            db.query.comments.findFirst({
                where: eq(comments.id, params.commentId),
                with: {
                    blog: true,
                },
            }),
        ]);

        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        if (!comment)
            return NextResponse.json({
                code: 404,
                message: "Comment not found!",
            });

        const loveId = nanoid();

        await db.insert(commentLoves).values({
            id: loveId,
            userId: user.id,
            commentId: params.commentId,
        });

        addNotification({
            userId: comment.authorId,
            notifierId: user?.id!,
            title: "Comment loved",
            content: `@${user?.username} loved your comment`,
            props: {
                type: "blogCommentLove",
                blogId: comment.blog.id,
                commentId: comment.id,
                blogThumbnailUrl: comment.blog.thumbnailUrl!,
                commentContent: comment.content,
            },
            type: "blogCommentLove",
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
