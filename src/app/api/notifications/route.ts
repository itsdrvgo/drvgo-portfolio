import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import {
    insertNotificationSchema,
    notifications,
    users,
} from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { Notification } from "@/src/types/notification";
import { ne } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const user = await getAuthorizedUser(BitFieldPermissions.Administrator);
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const { content, notifierId, props, title } = insertNotificationSchema
            .omit({
                id: true,
                read: true,
                userId: true,
            })
            .parse(body);

        const data = await db.query.users.findMany({
            where: ne(users.id, notifierId),
        });

        const notificationsToInsert = data.map((user) => ({
            id: nanoid(),
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
        return handleError(err);
    }
}
