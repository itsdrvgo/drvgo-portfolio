import { db } from "@/src/lib/drizzle";
import { blogs, comments, users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { blogCreateSchema } from "@/src/lib/validation/blogs";
import { currentUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const authUser = await currentUser();
        if (!authUser)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

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
        const authUser = await currentUser();
        if (!authUser)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
        });
        if (!dbUser || ["user", "moderator"].includes(dbUser.role))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const json = await req.json();
        const body = blogCreateSchema.parse(json);

        const blogId = crypto.randomUUID();

        await db.insert(blogs).values({
            id: blogId,
            title: body.title,
            content: body.content,
            thumbnailUrl: body.thumbnailUrl,
            authorId: authUser.id,
            description: body.description ?? "No description",
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
