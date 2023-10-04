import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { blogs, comments } from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { blogCreateSchema } from "@/src/lib/validation/blogs";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const filteredBlogs = await db.query.blogs.findMany({
            with: {
                author: {
                    with: {
                        account: true,
                    },
                },
                comments: {
                    orderBy: [desc(comments.createdAt)],
                    with: {
                        user: {
                            with: {
                                account: true,
                            },
                        },
                        loves: true,
                        blog: true,
                    },
                },
                likes: true,
                views: true,
            },
            where: eq(blogs.published, true),
            orderBy: [desc(blogs.createdAt)],
        });

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

        await db.insert(blogs).values({
            id: blogId,
            title: title,
            content: content,
            thumbnailUrl: thumbnailUrl,
            authorId: user.id,
            description: description ?? "No description",
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(blogId),
        });
    } catch (err) {
        return handleError(err);
    }
}
