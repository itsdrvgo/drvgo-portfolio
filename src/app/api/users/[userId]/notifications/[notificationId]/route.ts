import { db } from "@/src/lib/drizzle";
import { notifications } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import {
    NotificationContext,
    notificationContextSchema,
} from "@/src/lib/validation/route";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: NotificationContext) {
    try {
        const { params } = notificationContextSchema.parse(context);

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
        handleError(err);
    }
}
