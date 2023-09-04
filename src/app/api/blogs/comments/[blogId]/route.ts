import { db } from "@/src/lib/drizzle";
import { comments, insertCommentSchema } from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        const filteredComments = await db.query.comments.findMany({
            where: eq(comments.blogId, params.blogId),
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
    try {
        const body = await req.json();

        const { authorId, content } = insertCommentSchema
            .omit({
                id: true,
            })
            .parse(body);
        const { params } = blogContextSchema.parse(context);

        const user = await getAuthorizedUser();
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const commentId = crypto.randomUUID();

        await db.insert(comments).values({
            id: commentId,
            blogId: params.blogId,
            authorId,
            content,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(commentId),
        });
    } catch (err) {
        handleError(err);
    }
}
