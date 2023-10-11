import { db } from "@/src/lib/drizzle";
import { comments, insertCommentSchema } from "@/src/lib/drizzle/schema";
import {
    getBlogFromCache,
    updateBlogInCache,
} from "@/src/lib/redis/methods/blog";
import { addNotification, handleError } from "@/src/lib/utils";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        const filteredComments = await db.query.comments.findMany({
            where: eq(comments.blogId, params.blogId),
            with: {
                user: true,
                loves: true,
            },
            orderBy: [desc(comments.createdAt)],
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(filteredComments),
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function POST(req: NextRequest, context: BlogContext) {
    try {
        const body = await req.json();

        const { authorId, content } = insertCommentSchema
            .omit({
                id: true,
            })
            .parse(body);
        const { params } = blogContextSchema.parse(context);

        const [user, blog] = await Promise.all([
            currentUser(),
            getBlogFromCache(params.blogId),
        ]);

        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        if (!blog)
            return NextResponse.json({
                code: 404,
                message: "Blog not found!",
            });

        const commentId = nanoid();

        await Promise.all([
            db.insert(comments).values({
                id: commentId,
                blogId: params.blogId,
                authorId,
                content,
            }),
            updateBlogInCache({
                ...blog,
                comments: blog.comments + 1,
            }),
        ]);

        addNotification({
            userId: blog.authorId,
            content: `@${user.username} commented on your blog`,
            title: "New comment",
            notifierId: user.id,
            props: {
                type: "blogComment",
                blogId: blog.id,
                blogThumbnailUrl: blog.thumbnailUrl!,
                commentContent: content,
                commentId,
            },
            type: "blogComment",
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(commentId),
        });
    } catch (err) {
        return handleError(err);
    }
}
