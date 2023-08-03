import { db } from "@/src/lib/drizzle";
import { views } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        const newView = await db.insert(views).values({
            blogId: Number(params.blogId),
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(newView.insertId),
        });
    } catch (err) {
        handleError(err);
    }
}
