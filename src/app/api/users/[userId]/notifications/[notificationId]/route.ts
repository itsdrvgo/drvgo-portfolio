import { db } from "@/src/lib/drizzle";
import { notifications } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import {
    NotificationContext,
    notificationContextSchema,
} from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: NotificationContext) {
    try {
        const { params } = notificationContextSchema.parse(context);

        if (!(await verifyUserHasAccessToNotification(params.notificationId)))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        await db
            .update(notifications)
            .set({
                read: true,
            })
            .where(eq(notifications.id, params.notificationId));

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}

async function verifyUserHasAccessToNotification(notificationId: string) {
    const user = await currentUser();
    if (!user) return false;

    const notification = await db.query.notifications.findFirst({
        where: and(
            eq(notifications.id, notificationId),
            eq(notifications.userId, user.id)
        ),
    });
    if (!notification) return false;

    return true;
}
