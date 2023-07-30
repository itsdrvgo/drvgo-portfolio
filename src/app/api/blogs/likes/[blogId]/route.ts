import { authOptions } from "@/src/lib/auth/auth";
import { db } from "@/src/lib/drizzle";
import { blogs, likes, users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { likeUpdateSchema } from "@/src/lib/validation/blogs";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: BlogContext) {
    const body = await req.json();

    try {
        const { isLiked, userId } = likeUpdateSchema.parse(body);
        const { params } = blogContextSchema.parse(context);

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

        if (isLiked) {
            await db
                .delete(likes)
                .where(eq(likes.blogId, Number(params.blogId)));

            await db
                .update(blogs)
                .set({
                    likes: sql`${blogs.likes} - 1`,
                })
                .where(eq(blogs.id, Number(params.blogId)));

            return NextResponse.json({
                code: 200,
                message: "Ok",
            });
        } else {
            const newLike = await db.insert(likes).values({
                userId: userId,
                blogId: Number(params.blogId),
            });

            await db
                .update(blogs)
                .set({
                    likes: sql`${blogs.likes} + 1`,
                })
                .where(eq(blogs.id, Number(params.blogId)));

            return NextResponse.json({
                code: 200,
                message: "Ok",
                data: JSON.stringify(newLike.insertId),
            });
        }
    } catch (err) {
        handleError(err);
    }
}
