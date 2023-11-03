import { db } from "@/src/lib/drizzle";
import { notifications } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { UserContext, userContextSchema } from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: UserContext) {
    try {
        const { params } = userContextSchema.parse(context);

        const user = await currentUser();
        if (!user || user.id !== params.userId)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        await db
            .update(notifications)
            .set({
                read: true,
            })
            .where(eq(notifications.userId, params.userId));

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
