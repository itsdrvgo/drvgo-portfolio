import { db } from "@/src/lib/drizzle";
import { comments } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
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
        return handleError(err);
    }
}
