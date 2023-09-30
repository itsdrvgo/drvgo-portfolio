import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { notifications, projects, users } from "@/src/lib/drizzle/schema";
import { fetchRedis } from "@/src/lib/redis";
import { hasPermission } from "@/src/lib/utils";
import { messageArrayValidator } from "@/src/lib/validation/messages";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { Message } from "@/src/types/chat";
import { currentUser } from "@clerk/nextjs";
import { and, desc, eq, or } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import GoBackButton from "../global/buttons/go-back-button";
import DRVGOLogo from "../global/DRVGOLogo";
import { EmptyPlaceholder } from "../ui/empty-placeholder";
import ChatInput from "./chat-input";
import ChatSection from "./chat-section";
import ChatsNavbar from "./chats-navbar";

async function getChatMessages(chatId: string) {
    try {
        const results: string[] = await fetchRedis(
            "zrange",
            `chat:${chatId}:messages`,
            0,
            -1
        );

        const dbMessages = results.map(
            (message) => JSON.parse(message) as Message
        );
        const reversedMessages = dbMessages.reverse();

        const messages = messageArrayValidator.parse(reversedMessages);
        return messages;
    } catch (err) {
        console.error(err);
        notFound();
    }
}

interface PageProps extends DefaultProps {
    params?: {
        chatId?: string;
    };
}

async function ChatsViewPage({ params }: PageProps) {
    const user = await currentUser();
    if (!user) redirect("/auth");

    const parsedUser = userSchema.parse(user);

    const [userNotifications, userProject] = await Promise.all([
        db.query.notifications.findMany({
            where: and(
                eq(notifications.userId, user.id),
                eq(notifications.read, false)
            ),
            orderBy: [desc(notifications.createdAt)],
            with: {
                notifier: true,
            },
        }),
        db.query.projects.findFirst({
            where: and(
                eq(projects.purchaserId, user.id),
                or(
                    eq(projects.status, "pending"),
                    eq(projects.status, "accepted"),
                    eq(projects.status, "in_progress"),
                    eq(projects.status, "paid")
                )
            ),
        }),
    ]);

    if (
        !userProject &&
        !hasPermission(
            parsedUser.privateMetadata.permissions,
            BitFieldPermissions.Administrator
        )
    )
        return (
            <div className="relative flex h-screen flex-1 flex-col justify-between bg-stone-950">
                <ChatsNavbar data={userNotifications} user={parsedUser} />

                <section className="flex h-full flex-col items-center justify-center p-5">
                    <EmptyPlaceholder
                        title="No projects"
                        description="You need to have an active project in order to chat with the seller."
                        icon="warning"
                        className="max-w-md"
                        endContent={<GoBackButton />}
                    />
                </section>
            </div>
        );

    if (params && params.chatId) {
        const { chatId } = params;

        const [userId1, userId2] = chatId.split("--");
        if (![userId1, userId2].includes(parsedUser.id)) redirect("/chats");

        const chatPartnerId = userId1 === parsedUser.id ? userId2 : userId1;
        const chatPartner = await db.query.users.findFirst({
            where: eq(users.id, chatPartnerId),
            with: {
                account: true,
            },
        });
        if (!chatPartner) notFound();

        const hasManagePagesPerms = hasPermission(
            parsedUser.privateMetadata.permissions,
            BitFieldPermissions.ManagePages
        );

        const chatPartnerHasManagePagesPerms = hasPermission(
            chatPartner.account.permissions,
            BitFieldPermissions.ManagePages
        );

        if (!hasManagePagesPerms && !chatPartnerHasManagePagesPerms)
            redirect("/chats");

        const initialMessages = await getChatMessages(chatId);

        return (
            <div className="relative flex h-screen flex-1 flex-col justify-between bg-stone-950">
                <ChatsNavbar
                    data={userNotifications}
                    partner={chatPartner}
                    user={parsedUser}
                />

                <ChatSection
                    chatId={chatId}
                    initialMessages={initialMessages}
                    userId={parsedUser.id}
                    userImage={parsedUser.imageUrl}
                    chatPartner={chatPartner}
                />

                <ChatInput chatPartner={chatPartner} chatId={chatId} />
            </div>
        );
    } else {
        return (
            <div className="relative flex h-screen flex-1 flex-col justify-between bg-stone-950">
                <ChatsNavbar data={userNotifications} user={parsedUser} />

                <section className="flex h-full flex-col items-center justify-center">
                    <DRVGOLogo
                        height={300}
                        width={300}
                        className="opacity-50"
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                        <h1 className="text-2xl font-semibold opacity-60">
                            DRVGO
                        </h1>
                        <p className="opacity-50 ">
                            Select a chat to start messaging
                        </p>
                    </div>
                </section>
            </div>
        );
    }
}

export default ChatsViewPage;
