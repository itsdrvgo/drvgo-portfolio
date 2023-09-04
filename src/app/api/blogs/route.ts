import { db } from "@/src/lib/drizzle";
import { blogs, comments } from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { blogCreateSchema } from "@/src/lib/validation/blogs";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const filteredBlogs = await db.query.blogs.findMany({
            with: {
                author: true,
                comments: {
                    orderBy: [desc(comments.createdAt)],
                    with: {
                        user: true,
                        loves: true,
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
        handleError(err);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const user = await getAuthorizedUser();
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const { title, content, description, thumbnailUrl } =
            blogCreateSchema.parse(body);

        const blogId = crypto.randomUUID();

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
        handleError(err);
    }
}
