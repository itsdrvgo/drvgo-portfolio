import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { accounts, users } from "@/src/lib/drizzle/schema";
import { fetchRedis } from "@/src/lib/redis";
import { chatHrefConstructor, hasPermission } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Message } from "@/src/types/chat";
import { currentUser } from "@clerk/nextjs";
import { like, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import SideBar from "./sidebar";

async function SideBarFetch({ children }: DefaultProps) {
    const user = await currentUser();
    if (!user) redirect("/auth");

    const chatters = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.Administrator
    )
        ? await db.select().from(users).where(ne(users.id, user.id))
        : (
              await db.query.accounts.findMany({
                  where: like(accounts.roles, "%owner%"),
                  with: {
                      user: true,
                  },
              })
          ).map((account) => account.user);

    const chattersWithLastMessageAndUnseen = await Promise.all(
        chatters.map(async (chatter) => {
            const result: string[] = await fetchRedis(
                "zrange",
                `chat:${chatHrefConstructor(user.id, chatter.id)}:messages`,
                -1,
                -1
            );

            const lastMessage = result.length > 0 ? result[0] : null;
            const parsedMessage = lastMessage
                ? (JSON.parse(lastMessage) as Message)
                : null;

            return {
                ...chatter,
                lastMessage: parsedMessage,
            };
        })
    );

    const sortedChatters = chattersWithLastMessageAndUnseen.sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;

        return (
            new Date(b.lastMessage.timestamp).getTime() -
            new Date(a.lastMessage.timestamp).getTime()
        );
    });

    return <SideBar chatters={sortedChatters}>{children}</SideBar>;
}

export default SideBarFetch;
