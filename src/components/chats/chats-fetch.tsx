import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { projects } from "@/src/lib/drizzle/schema";
import { getUserFromCache } from "@/src/lib/redis/methods/user";
import { chatHrefConstructor, hasPermission } from "@/src/lib/utils";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { and, eq, or } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ChatMessagesFetch from "./sections/messages-fetch";
import ChatNoAccess from "./sections/no-access";
import NoChatsPage from "./sections/no-chats-page";
import ChatsNoPerms from "./sections/no-perms";

interface PageProps extends DefaultProps {
    searchParams?: {
        uId?: string;
        pId?: string;
    };
}

async function ChatsFetch({ searchParams }: PageProps) {
    const user = await currentUser();
    if (!user) redirect("/auth");

    const parsedUser = userSchema
        .omit({
            emailAddresses: true,
        })
        .parse(user);

    const userProject = await db.query.projects.findFirst({
        where: and(
            eq(projects.purchaserId, user.id),
            or(
                eq(projects.status, "pending"),
                eq(projects.status, "accepted"),
                eq(projects.status, "in_progress"),
                eq(projects.status, "paid")
            )
        ),
    });

    const isAuthorizedToSendMessages =
        hasPermission(
            parsedUser.privateMetadata.permissions,
            BitFieldPermissions.SendMessages
        ) || userProject;

    if (!isAuthorizedToSendMessages) return <ChatsNoPerms />;
    if (!searchParams) return <NoChatsPage />;

    const { uId, pId } = searchParams;
    if (!uId || !pId) return <NoChatsPage />;
    if (![uId, pId].includes(parsedUser.id)) return <ChatNoAccess />;

    const chatPartnerId = uId === parsedUser.id ? pId : uId;
    const chatPartner = await getUserFromCache(chatPartnerId);
    if (!chatPartner) notFound();

    const hasManagePagesPerms = hasPermission(
        parsedUser.privateMetadata.permissions,
        BitFieldPermissions.ManagePages
    );

    const chatPartnerHasManagePagesPerms = hasPermission(
        chatPartner.permissions,
        BitFieldPermissions.ManagePages
    );

    if (!hasManagePagesPerms && !chatPartnerHasManagePagesPerms)
        return <ChatNoAccess />;

    const chatId = chatHrefConstructor(uId, pId);

    return (
        <ChatMessagesFetch
            user={parsedUser}
            chatPartner={chatPartner}
            chatId={chatId}
        />
    );
}

export default ChatsFetch;
