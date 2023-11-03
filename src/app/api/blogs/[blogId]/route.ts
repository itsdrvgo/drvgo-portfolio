import { db } from "@/src/lib/drizzle";
import { blogs } from "@/src/lib/drizzle/schema";
import { addNotification } from "@/src/lib/notifications";
import {
    deleteBlogFromCache,
    getAllBlogsFromCache,
    getBlogFromCache,
    updateBlogInCache,
} from "@/src/lib/redis/methods/blog";
import { handleError } from "@/src/lib/utils";
import { postPatchSchema, publishSchema } from "@/src/lib/validation/blogs";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        const blog = await getBlogFromCache(params.blogId);
        if (!blog)
            return NextResponse.json({
                code: 404,
                message: "Blog not found!",
            });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(blog),
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        if (!(await verifyCurrentUserHasAccessToBlog(params.blogId)))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        await Promise.all([
            db.delete(blogs).where(eq(blogs.id, params.blogId)),
            deleteBlogFromCache(params.blogId),
        ]);

        return NextResponse.json({
            code: 204,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function PATCH(req: NextRequest, context: BlogContext) {
    try {
        const json = await req.json();

        const { params } = blogContextSchema.parse(context);

        const { state, user } = await verifyCurrentUserHasAccessToBlog(
            params.blogId
        );
        if (!state || !user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const body = postPatchSchema.parse(json);

        const blog = await getBlogFromCache(params.blogId);
        if (!blog)
            return NextResponse.json({
                code: 404,
                message: "Blog not found!",
            });

        switch (body.action) {
            case "edit": {
                try {
                    const isBlogPublishedAndHasChanges =
                        blog.published &&
                        (JSON.stringify(blog.content) !==
                            JSON.stringify(body.content) ||
                            (blog.title !== "Untitled Blog" &&
                                JSON.stringify(blog.title) !==
                                    JSON.stringify(body.title)) ||
                            JSON.stringify(blog.thumbnailUrl) !==
                                JSON.stringify(body.thumbnailUrl) ||
                            JSON.stringify(blog.description) !==
                                JSON.stringify(body.description));

                    await Promise.all([
                        db
                            .update(blogs)
                            .set({
                                title: body.title,
                                content: body.content,
                                thumbnailUrl: body.thumbnailUrl,
                                description: body.description,
                                updatedAt: isBlogPublishedAndHasChanges
                                    ? new Date()
                                    : blog.updatedAt
                                    ? new Date(blog.updatedAt)
                                    : null,
                            })
                            .where(eq(blogs.id, params.blogId)),
                        updateBlogInCache({
                            ...blog,
                            title: body.title!,
                            content: body.content ?? null,
                            thumbnailUrl: body.thumbnailUrl ?? null,
                            description: body.description ?? "No description",
                            updatedAt: isBlogPublishedAndHasChanges
                                ? new Date().toISOString()
                                : blog.updatedAt ?? null,
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

            case "publish": {
                try {
                    const publishBody = publishSchema.parse(body);

                    await Promise.all([
                        db
                            .update(blogs)
                            .set({
                                published: publishBody.published,
                            })
                            .where(eq(blogs.id, params.blogId)),
                        updateBlogInCache({
                            ...blog,
                            published: publishBody.published,
                        }),
                    ]);

                    if (publishBody.published)
                        addNotification({
                            notifierId: blog.authorId,
                            title: "New Blog",
                            content: `@${user.username} published a new blog`,
                            props: {
                                type: "newBlog",
                                blogId: blog.id,
                                blogThumbnailUrl: blog.thumbnailUrl!,
                                blogTitle: blog.title,
                            },
                            type: "newBlog",
                        });

                    return NextResponse.json({
                        code: 200,
                        message: "Ok",
                    });
                } catch (err) {
                    return handleError(err);
                }
            }
        }
    } catch (err) {
        return handleError(err);
    }
}

async function verifyCurrentUserHasAccessToBlog(blogId: string) {
    const user = await currentUser();
    if (!user)
        return {
            state: false,
            user: null,
        };

    const data = await getAllBlogsFromCache();
    const filteredBlogs = data.filter(
        (blog) => blog.authorId === user.id && blog.id === blogId
    );

    return {
        state: filteredBlogs.length > 0,
        user,
    };
}
