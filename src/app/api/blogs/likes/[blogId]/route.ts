import { db } from "@/src/lib/drizzle";
import { likes } from "@/src/lib/drizzle/schema";
import {
    getBlogFromCache,
    updateBlogInCache,
} from "@/src/lib/redis/methods/blog";
import { handleError } from "@/src/lib/utils";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: BlogContext) {
    try {
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

        await Promise.all([
            db.insert(likes).values({
                id: nanoid(),
                userId: user.id,
                blogId: params.blogId,
            }),
            updateBlogInCache({
                ...blog,
                likes: blog.likes + 1,
            }),
        ]);

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(req: NextRequest, context: BlogContext) {
    try {
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

        await Promise.all([
            db
                .delete(likes)
                .where(
                    and(
                        eq(likes.userId, user.id),
                        eq(likes.blogId, params.blogId)
                    )
                ),
            updateBlogInCache({
                ...blog,
                likes: blog.likes <= 0 ? 0 : blog.likes - 1,
            }),
        ]);

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
