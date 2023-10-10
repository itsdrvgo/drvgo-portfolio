import { BitFieldPermissions } from "@/src/config/const";
import { fetchRedis } from "@/src/lib/redis";
import { getAllUsersFromCache } from "@/src/lib/redis/methods/user";
import {
    chatHrefConstructor,
    hasPermission,
    parseJSONToObject,
} from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Message } from "@/src/types/chat";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SideBar from "./sidebar";

async function SideBarFetch({ children }: DefaultProps) {
    const user = await currentUser();
    if (!user) redirect("/auth");

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
                ? parseJSONToObject<Message>(lastMessage)
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
