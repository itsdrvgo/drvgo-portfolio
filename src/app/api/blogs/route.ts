import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { blogs } from "@/src/lib/drizzle/schema";
import {
    addBlogToCache,
    getAllBlogsFromCache,
} from "@/src/lib/redis/methods/blog";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { blogCreateSchema } from "@/src/lib/validation/blogs";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const allBlogs = await getAllBlogsFromCache();
        const filteredBlogs = allBlogs
            .filter((blog) => blog.published)
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(filteredBlogs),
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const user = await getAuthorizedUser(
            BitFieldPermissions.ManageBlogs | BitFieldPermissions.ManagePages
        );
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const { title, content, description, thumbnailUrl } =
            blogCreateSchema.parse(body);

        const blogId = nanoid();

        await Promise.all([
            db.insert(blogs).values({
                id: blogId,
                title: title,
                content: content,
                thumbnailUrl: thumbnailUrl,
                authorId: user.id,
                description: description ?? "No description",
            }),
            addBlogToCache({
                id: blogId,
                title: title,
                content: content ?? null,
                thumbnailUrl: thumbnailUrl ?? null,
                authorId: user.id,
                description: description ?? "No description",
                createdAt: new Date().toISOString(),
                updatedAt: null,
                published: false,
                likes: 0,
                views: 0,
                comments: 0,
            }),
        ]);

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(blogId),
        });
    } catch (err) {
        return handleError(err);
    }
}
