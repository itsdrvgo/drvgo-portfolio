import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import {
    insertNotificationSchema,
    notifications,
} from "@/src/lib/drizzle/schema";
import { getAllUsersFromCache } from "@/src/lib/redis/methods/user";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { Notification } from "@/src/types/notification";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const user = await getAuthorizedUser(BitFieldPermissions.ManagePages);
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const { content, notifierId, props, title, type } =
            insertNotificationSchema
                .omit({
                    id: true,
                    read: true,
                    userId: true,
                })
                .parse(body);

        const users = await getAllUsersFromCache();
        const filteredUsers = users.filter((user) => user.id !== notifierId);

        const notificationsToInsert = filteredUsers.map((user) => ({
            id: nanoid(),
            userId: user.id,
            content,
            title,
            notifierId,
            props: props as Notification["props"],
            type,
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
