import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { redis } from "@/src/lib/redis";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const user = await getAuthorizedUser(BitFieldPermissions.Administrator);
        if (!user)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized",
            });

        const blogs = await db.query.blogs.findMany({
            with: {
                likes: true,
                views: true,
                comments: true,
            },
        });

        const pipeline = redis.pipeline();
        blogs
            .map((blog) => ({
                id: blog.id,
                title: blog.title,
                thumbnailUrl: blog.thumbnailUrl,
                description: blog.description,
                content: blog.content,
                createdAt: blog.createdAt.toISOString(),
                updatedAt: blog.updatedAt?.toISOString() ?? null,
                authorId: blog.authorId,
                published: blog.published,
                likes: blog.likes.length,
                views: blog.views.length,
                comments: blog.comments.length,
            }))
            .forEach((blog) => {
                pipeline.set(`blog:${blog.id}`, JSON.stringify(blog));
            });

        await pipeline.exec();

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(blogs),
        });
    } catch (err) {
        return handleError(err);
    }
}
