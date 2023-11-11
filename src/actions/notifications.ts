"use server";

import { eq, lt } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../lib/drizzle";
import { notifications } from "../lib/drizzle/schema";
import { getAllUsersFromCache } from "../lib/redis/methods/user";
import { Notification } from "../types/notification";

export async function addNotificationToAllUsers({
    content,
    notifierId,
    props,
    title,
    type,
}: {
    notifierId: string;
    content: string;
    title: string;
    type: Notification["props"]["type"];
    props: Notification["props"];
}) {
    const users = await getAllUsersFromCache();
    const filteredUsers = users.filter((user) => user.id !== notifierId);

    const notificationsToInsert = filteredUsers.map((user) => ({
        id: nanoid(),
        userId: user.id,
        content,
        title,
        notifierId,
        type,
        props,
    }));

    await db.insert(notifications).values(notificationsToInsert);

    return {
        success: true,
    };
}

export async function addNotificationToUser({
    content,
    notifierId,
    receiverId,
    props,
    title,
    type,
}: {
    notifierId: string;
    receiverId: string;
    content: string;
    title: string;
    type: Notification["props"]["type"];
    props: Notification["props"];
}) {
    const notificationId = nanoid();

    await Promise.all([
        db.insert(notifications).values({
            id: notificationId,
            userId: receiverId,
            content,
            title,
            notifierId,
            type,
            props,
        }),
        db
            .delete(notifications)
            .where(
                lt(notifications.createdAt, new Date(Date.now() - 2592000000))
            ),
    ]);

    return {
        success: true,
    };
}

export async function markAllNotificationsAsRead({
    userId,
}: {
    userId: string;
}) {
    await db
        .update(notifications)
        .set({
            read: true,
        })
        .where(eq(notifications.userId, userId));

    return {
        success: true,
    };
}

export async function markNotificationAsRead({
    notificationId,
}: {
    notificationId: string;
}) {
    await db
        .update(notifications)
        .set({
            read: true,
        })
        .where(eq(notifications.id, notificationId));

    return {
        success: true,
    };
}
