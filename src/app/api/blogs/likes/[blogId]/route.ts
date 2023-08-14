import { db } from "@/src/lib/drizzle";
import { likes, users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: BlogContext) {
    try {
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

        const newLike = await db.insert(likes).values({
            userId: user.id,
            blogId: Number(params.blogId),
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(newLike.insertId),
        });
    } catch (err) {
        handleError(err);
    }
}

export async function DELETE(req: NextRequest, context: BlogContext) {
    try {
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

        await db
            .delete(likes)
            .where(
                and(
                    eq(likes.userId, user.id),
                    eq(likes.blogId, Number(params.blogId))
                )
            );

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        handleError(err);
    }
}
