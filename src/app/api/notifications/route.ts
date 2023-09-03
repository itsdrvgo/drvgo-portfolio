import { db } from "@/src/lib/drizzle";
import {
    insertNotificationSchema,
    notifications,
    users,
} from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { Notification } from "@/src/types/notification";
import { ne } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const { content, notifierId, props, title } = insertNotificationSchema
            .omit({
                id: true,
                read: true,
                userId: true,
            })
            .parse(body);

        const allUsers = await db.query.users.findMany({
            where: ne(users.id, notifierId),
        });

        const notificationsToInsert = allUsers.map((user) => ({
            id: crypto.randomUUID(),
            userId: user.id,
            content,
            title,
            notifierId,
            props: props as Notification["props"],
        }));

        await db.insert(notifications).values(notificationsToInsert);

        return NextResponse.json({
            code: 201,
            message: "Ok",
        });
    } catch (err) {
        handleError(err);
    }
}
