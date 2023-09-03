import { db } from "@/src/lib/drizzle";
import {
    insertNotificationSchema,
    notifications,
} from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { UserContext, userContextSchema } from "@/src/lib/validation/route";
import { Notification } from "@/src/types/notification";
import { eq, lt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: UserContext) {
    const body = await req.json();

    try {
        const { params } = userContextSchema.parse(context);

        const { content, title, notifierId, props } = insertNotificationSchema
            .omit({
                userId: true,
                id: true,
            })
            .parse(body);

        const notificationId = crypto.randomUUID();

        await db.insert(notifications).values({
            id: notificationId,
            userId: params.userId,
            content,
            title,
            notifierId,
            props: props as Notification["props"],
        });

        await db
            .delete(notifications)
            .where(
                lt(notifications.createdAt, new Date(Date.now() - 2592000000))
            );

        return NextResponse.json({
            code: 201,
            message: "Ok",
            data: notificationId,
        });
    } catch (err) {
        handleError(err);
    }
}

export async function PATCH(req: NextRequest, context: UserContext) {
    try {
        const { params } = userContextSchema.parse(context);

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
        handleError(err);
    }
}
