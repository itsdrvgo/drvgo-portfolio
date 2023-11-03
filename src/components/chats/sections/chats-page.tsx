"use client";

import { Message } from "@/src/lib/drizzle/schema";
import { pusherClient } from "@/src/lib/pusher/client";
import {
    chatHrefConstructor,
    cn,
    parseJSONToObject,
    toPusherKey,
} from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { ChatWithExtendedMessages, DefaultProps } from "@/src/types";
import { CachedUser } from "@/src/types/cache";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ChatInput from "../chat-input";
import ChatSection from "../chat-section";
import ChatsNavbar from "../chats-navbar";
import { ChatSectionSkeleton } from "../skeletons/sidebar";

interface PageProps extends DefaultProps {
    chatPartner: CachedUser;
    user: ClerkUserWithoutEmail;
    chatId: string;
}

function ChatsPage({
    className,
    chatPartner,
    user,
    chatId,
    ...props
}: PageProps) {
    const pathname = usePathname();

    const [messages, setMessages] = useState<Message[]>([]);
    const [pendingMessages, setPendingMessages] = useState<string[]>([]);
    const [text, setText] = useState("");
    const textAreaRef = useRef<HTMLInputElement | null>(null);

    const [finalText, setFinalText] = useState("");

    useEffect(() => {
        if (messages.filter((msg) => msg.status === "sent").length) {
            axios
                .patch<ResponseData>(`/api/chats/${chatId}/messages`)
                .then(({ data: resData }) => {
                    if (resData.code !== 200)
                        return console.error(resData.message);
                    console.log("seen");
                })
                .catch((err) => {
                    console.error(err);
                });
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
                pathname ===
                `/chats/${chatHrefConstructor(user.id, receiverId)}`;

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
    }, [chatId, pathname]);

    const { mutate: sendMessage } = useMutation({
        mutationFn: async () => {
            const body = {
                text: finalText,
                chatId: chatId,
            };

            const { data } = await axios.post<ResponseData>(
                `/api/chats/${chatId}/send`,
                JSON.stringify(body)
            );
            return data;
        },
        onMutate: () => {
            const oldText = text;

            setPendingMessages((prev) => [...prev, text]);

            setText("");
            textAreaRef.current?.focus();

            return { oldText };
        },
        onError: (err, _, context) => {
            console.error(err);
            setText(context?.oldText || "");

            setPendingMessages((prev) => {
                const newPendingMessages = [...prev];
                newPendingMessages.pop();

                return newPendingMessages;
            });

            return toast.error("Something went wrong, try again later!");
        },
        onSuccess: (resData) => {
            if (resData.code !== 201) return toast.error(resData.message);
        },
    });

    const { isLoading } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
            const { data } = await axios.get<ResponseData>(
                `/api/chats/${chatId}`
            );

            const chatData = parseJSONToObject<ChatWithExtendedMessages>(
                data.data
            );
            setMessages(chatData.messages);
            return chatData;
        },
    });

    if (isLoading) return <ChatSectionSkeleton />;

    return (
        <div
            className={cn(
                "relative flex h-screen w-full flex-1 flex-col justify-between bg-stone-950",
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
                sendMessage={sendMessage}
                textAreaRef={textAreaRef}
            />
        </div>
    );
}

export default ChatsPage;
