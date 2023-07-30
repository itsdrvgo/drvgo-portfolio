import { authOptions } from "@/src/lib/auth/auth";
import { db } from "@/src/lib/drizzle";
import { blogs } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { postPatchSchema, publishSchema } from "@/src/lib/validation/blogs";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        if (!(await verifyCurrentUserHasAccessToBlog(params.blogId)))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        await db.delete(blogs).where(eq(blogs.id, Number(params.blogId)));
        return NextResponse.json({
            code: 204,
            message: "Ok",
        });
    } catch (err) {
        handleError(err);
    }
}

export async function PATCH(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        if (!(await verifyCurrentUserHasAccessToBlog(params.blogId)))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const json = await req.json();
        const body = postPatchSchema.parse(json);

        switch (body.action) {
            case "edit": {
                try {
                    await db
                        .update(blogs)
                        .set({
                            title: body.title,
                            content: body.content,
                            thumbnailUrl: body.thumbnailUrl,
                        })
                        .where(eq(blogs.id, Number(params.blogId)));

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
                        })
                        .where(eq(blogs.id, Number(params.blogId)));

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
        handleError(err);
    }
}

async function verifyCurrentUserHasAccessToBlog(blogId: string) {
    const session = await getServerSession(authOptions);
    if (!session) return false;

    const data = await db.query.blogs.findMany({
        where: and(
            eq(blogs.authorId, session.user.id),
            eq(blogs.id, Number(blogId))
        ),
    });

    return data.length > 0;
}
