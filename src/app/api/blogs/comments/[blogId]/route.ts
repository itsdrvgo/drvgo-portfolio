import { db } from "@/src/lib/drizzle";
import { comments, insertCommentSchema, users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: BlogContext) {
    try {
        const authUser = await currentUser();
        if (!authUser)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const { params } = blogContextSchema.parse(context);

        const filteredComments = await db.query.comments.findMany({
            where: eq(comments.blogId, Number(params.blogId)),
            with: {
                user: true,
                loves: true,
            },
            orderBy: [desc(comments.createdAt)],
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(filteredComments),
        });
    } catch (err) {
        handleError(err);
    }
}

export async function POST(req: NextRequest, context: BlogContext) {
    const body = await req.json();

    try {
        const { authorId, content } = insertCommentSchema.parse(body);
        const { params } = blogContextSchema.parse(context);

        const authUser = await currentUser();
        if (!authUser)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const user = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
        });
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const newComment = await db.insert(comments).values({
            authorId: authorId,
            blogId: Number(params.blogId),
            content: content,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(newComment.insertId),
        });
    } catch (err) {
        handleError(err);
    }
}
