import { Notification } from "@/src/types/notification";
import { lt } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../drizzle";
import { notifications } from "../drizzle/schema";

export async function addNotification(
    notification: Omit<Notification, "id" | "read" | "createdAt">
) {
    const notificationId = nanoid();

    await Promise.all([
        db.insert(notifications).values({
            id: notificationId,
            userId: notification.userId!,
            content: notification.content,
            title: notification.title,
            notifierId: notification.notifierId,
            props: notification.props,
            type: notification.type,
        }),
        db
            .delete(notifications)
            .where(
                lt(notifications.createdAt, new Date(Date.now() - 2592000000))
            ),
    ]);

    return notificationId;
}
