import { authOptions } from "@/src/lib/auth/auth";
import { db } from "@/src/lib/drizzle";
import { blogs, users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { blogCreateSchema } from "@/src/lib/validation/blogs";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const filteredBlogs = await db
            .select()
            .from(blogs)
            .where(eq(blogs.published, true));

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
        const session = await getServerSession(authOptions);
        if (!session)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });
        if (!dbUser || ["user", "moderator"].includes(dbUser.role))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const json = await req.json();
        const body = blogCreateSchema.parse(json);

        const newBlog = await db.insert(blogs).values({
            title: body.title,
            content: body.content,
            thumbnailUrl: body.thumbnailUrl,
            authorId: session.user.id,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(newBlog.insertId),
        });
    } catch (err) {
        handleError(err);
    }
}
