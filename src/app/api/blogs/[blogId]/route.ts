import { db } from "@/src/lib/drizzle";
import { blogs, NewBlog } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { postPatchSchema, publishSchema } from "@/src/lib/validation/blogs";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        const blog = await db.query.blogs.findFirst({
            where: eq(blogs.id, params.blogId),
        });

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

        await db.delete(blogs).where(eq(blogs.id, params.blogId));
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

        if (!(await verifyCurrentUserHasAccessToBlog(params.blogId)))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const body = postPatchSchema.parse(json);

        switch (body.action) {
            case "edit": {
                try {
                    const blog = await db.query.blogs.findFirst({
                        where: eq(blogs.id, params.blogId),
                    });

                    if (!blog)
                        return NextResponse.json({
                            code: 404,
                            message: "Blog not found!",
                        });

                    const updatedValues: Omit<NewBlog, "id"> = {
                        authorId: blog.authorId,
                        title: body.title ?? "Untitled Blog",
                        content: body.content,
                        thumbnailUrl: body.thumbnailUrl,
                        description: body.description ?? "No description",
                    };

                    if (
                        blog.published &&
                        (JSON.stringify(blog.content) !==
                            JSON.stringify(body.content) ||
                            (blog.title !== "Untitled Blog" &&
                                JSON.stringify(blog.title) !==
                                    JSON.stringify(body.title)) ||
                            JSON.stringify(blog.thumbnailUrl) !==
                                JSON.stringify(body.thumbnailUrl) ||
                            JSON.stringify(blog.description) !==
                                JSON.stringify(body.description))
                    ) {
                        await db
                            .update(blogs)
                            .set({
                                updatedAt: new Date(),
                                ...updatedValues,
                            })
                            .where(eq(blogs.id, params.blogId));
                    }

                    await db
                        .update(blogs)
                        .set({
                            title: body.title,
                            content: body.content,
                            thumbnailUrl: body.thumbnailUrl,
                            description: body.description,
                        })
                        .where(eq(blogs.id, params.blogId));

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

                    await db
                        .update(blogs)
                        .set({
                            title: publishBody.title,
                            content: publishBody.content,
                            thumbnailUrl: publishBody.thumbnailUrl,
                            published: publishBody.published,
                            description: publishBody.description,
                        })
                        .where(eq(blogs.id, params.blogId));

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
    const authUser = await currentUser();
    if (!authUser) return false;

    const data = await db.query.blogs.findMany({
        where: and(eq(blogs.authorId, authUser.id), eq(blogs.id, blogId)),
    });

    return data.length > 0;
}
