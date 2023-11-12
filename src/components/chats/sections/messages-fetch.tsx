"use client";

import { getChat } from "@/src/actions/chats";
import { Message } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { CachedUser } from "@/src/types/cache";
import { Skeleton, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ChatsNavbar from "../chats-navbar";
import ChatsPage from "./chats-page";

interface PageProps extends DefaultProps {
    chatId: string;
    user: ClerkUserWithoutEmail;
    chatPartner: CachedUser;
}

function ChatMessagesFetch({
    chatId,
    user,
    chatPartner,
    className,
    ...props
}: PageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const getChatMessages = async () => {
            const { chat } = await getChat({
                chatId,
                user,
            });

            setMessages(chat.messages);
            setIsLoading(false);
        };

        getChatMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId]);

    if (isLoading)
        return (
            // <div className="flex h-screen w-full items-center justify-center">
            //     <Spinner />
            // </div>
            <div
                className={cn(
                    "relative flex h-screen w-full flex-1 flex-col justify-between",
                    className
                )}
                style={{
                    backgroundImage: "url(/patterns/chat_bg.png)",
                    backgroundSize: "cover",
                }}
                {...props}
            >
                <ChatsNavbar partner={chatPartner} />

                <Spinner />

                <section className="flex items-center justify-between gap-3 bg-chat px-4 py-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </section>
            </div>
        );

    return (
        <ChatsPage
            chatId={chatId}
            chatPartner={chatPartner}
            user={user}
            messages={messages}
            setMessages={setMessages}
            {...props}
        />
    );
}

export default ChatMessagesFetch;
