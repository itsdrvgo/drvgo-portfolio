import { getAuthSession } from "@/src/lib/auth/auth";
import { db } from "@/src/lib/drizzle";
import { users, views } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        const session = await getAuthSession();
        if (!session)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const newView = await db.insert(views).values({
            userId: user.id,
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
