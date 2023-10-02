import { db } from "@/src/lib/drizzle";
import { views } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        await db.insert(views).values({
            id: nanoid(),
            blogId: params.blogId,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
