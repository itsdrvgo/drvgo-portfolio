"use client";

import { markMessageAsSeen, sendMessage } from "@/src/actions/chats";
import { Message } from "@/src/lib/drizzle/schema";
import { pusherClient } from "@/src/lib/pusher/client";
import {
    chatParamsGenerator,
    cn,
    handleClientError,
    toPusherKey,
} from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { CachedUser } from "@/src/types/cache";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ChatInput from "../chat-input";
import ChatSection from "../chat-section";
import ChatsNavbar from "../chats-navbar";

interface PageProps extends DefaultProps {
    chatPartner: CachedUser;
    user: ClerkUserWithoutEmail;
    chatId: string;
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
}

function ChatsPage({
    className,
    chatPartner,
    user,
    chatId,
    messages,
    setMessages,
    ...props
}: PageProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentUrl = pathname + "?" + searchParams.toString();

    const [pendingMessages, setPendingMessages] = useState<string[]>([]);
    const [text, setText] = useState("");
    const textAreaRef = useRef<HTMLInputElement | null>(null);

    const [finalText, setFinalText] = useState("");

    useEffect(() => {
        if (messages.filter((msg) => msg.status === "sent").length) {
            markMessageAsSeen({
                chatId,
                user,
            })
                .then(() => console.log("seen"))
                .catch((err) => console.error(err));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId, messages, pathname]);

    useEffect(() => {
        if (text.length) setFinalText(text);
    }, [text]);

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

        const messageHandler = (message: Message) => {
            setMessages((prev) => [message, ...prev]);

            setPendingMessages((prev) => {
                const newPendingMessages = [...prev].reverse();
                newPendingMessages.pop();

                return newPendingMessages;
            });
        };

        const messageSeenHandler = ({ receiverId }: { receiverId: string }) => {
            const shouldMarkAsSeen =
                currentUrl ===
                "/chats?" + chatParamsGenerator(user.id, receiverId);

            if (!shouldMarkAsSeen) return;

            setMessages((prev) => {
                const newMessages = [...prev];

                newMessages.forEach((msg) => {
                    msg.seenAt = new Date();
                    msg.status = "seen";
                });

                return newMessages;
            });
        };

        pusherClient.bind("message_seen", messageSeenHandler);
        pusherClient.bind("incoming_message", messageHandler);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
            pusherClient.unbind("incoming_message", messageHandler);
            pusherClient.unbind("message_seen", messageSeenHandler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId, currentUrl]);

    const { mutate: handleSendMessage } = useMutation({
        onMutate() {
            const oldText = text;

            setPendingMessages((prev) => [...prev, text]);
            setText("");
            textAreaRef.current?.focus();

            return {
                oldText,
            };
        },
        async mutationFn() {
            await sendMessage({
                chatId,
                content: finalText,
                user,
            });
        },
        onError(err, _, ctx) {
            setText(ctx?.oldText || "");
            setPendingMessages((prev) => {
                const newPendingMessages = [...prev];
                newPendingMessages.pop();

                return newPendingMessages;
            });

            handleClientError(err);
        },
    });

    return (
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

            <ChatSection
                userId={user.id}
                messages={messages}
                pendingMessages={pendingMessages}
            />

            <ChatInput
                chatPartner={chatPartner}
                text={text}
                setText={setText}
                sendMessage={() => handleSendMessage()}
                textAreaRef={textAreaRef}
            />
        </div>
    );
}

export default ChatsPage;
