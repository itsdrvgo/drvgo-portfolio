import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { messages, notifications } from "@/src/lib/drizzle/schema";
import { getAllUsersFromCache } from "@/src/lib/redis/methods/user";
import { hasPermission } from "@/src/lib/utils";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import SideBar from "./sidebar";

async function SideBarFetch({ children }: DefaultProps) {
    const user = await currentUser();
    if (!user) redirect("/auth");

    const parsedUser = userSchema
        .omit({
            emailAddresses: true,
        })
        .parse(user);

    const userNotifications = await db.query.notifications.findMany({
        where: and(
            eq(notifications.userId, user.id),
            eq(notifications.read, false)
        ),
        orderBy: [desc(notifications.createdAt)],
        with: {
            notifier: true,
        },
    });

    const isOwner = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.Administrator
    );

    const users = await getAllUsersFromCache();

    const chatters = isOwner
        ? users.filter((u) => u.id !== user.id)
        : users.filter((u) =>
              hasPermission(u.permissions, BitFieldPermissions.Administrator)
          );

    const lastMessages = await Promise.all(
        chatters.map(async (chatter) => {
            const lastMessage = await db.query.messages.findFirst({
                where: and(
                    eq(messages.senderId, user.id),
                    eq(messages.receiverId, chatter.id)
                ),
                orderBy: [desc(messages.sentAt)],
            });

            return lastMessage;
        })
    );

    return (
        <SideBar
            chatters={chatters}
            notifications={userNotifications}
            user={parsedUser}
            lastMessages={lastMessages}
        >
            {children}
        </SideBar>
    );
}

export default SideBarFetch;
