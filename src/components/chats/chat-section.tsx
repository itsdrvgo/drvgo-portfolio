"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { pusherClient } from "@/src/lib/pusher/client";
import { cn, toPusherKey } from "@/src/lib/utils";
import { Message } from "@/src/lib/validation/messages";
import { DefaultProps, UserWithAccount } from "@/src/types";
import { Avatar } from "@nextui-org/react";
import { format } from "date-fns";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChatMdx } from "../md/mdx-comp";

interface PageProps extends DefaultProps {
    chatId: string;
    initialMessages: Message[];
    userId: string;
    userImage?: string | null;
    chatPartner: UserWithAccount;
}

function ChatSection({
    className,
    chatId,
    chatPartner,
    initialMessages,
    userId,
    userImage,
    ...props
}: PageProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

        const messageHandler = (message: Message) => {
            setMessages((prev) => [message, ...prev]);
        };

        pusherClient.bind("incoming_message", messageHandler);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
            pusherClient.unbind("incoming_message", messageHandler);
        };
    }, [chatId]);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    const { scrollY } = useScroll({
        container: scrollRef,
    });

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 0) {
            setIsSticky(true);
        } else {
            setIsSticky(false);
        }
    });

    useEffect(() => {
        scrollDownRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        setTimeout(() => {
            setIsSticky(false);
        }, 5000);
    }, [isSticky]);

    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, "HH:mm");
    };

    const formatTimestampIntoDate = (timestamp: number) => {
        return format(timestamp, "dd/MM/yyyy");
    };

    function groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
        const groups = new Map<string, Message[]>();
        messages.forEach((message) => {
            const date = new Date(message.timestamp);
            const dateString = date.toDateString();
            if (groups.has(dateString)) {
                groups.get(dateString)?.push(message);
            } else {
                groups.set(dateString, [message]);
            }
        });
        return groups;
    }

    const groupedMessages = groupMessagesByDate(messages);

    return (
        <section
            className={cn("z-50 h-full overflow-y-auto px-4 pb-4")}
            ref={scrollRef}
            {...props}
        >
            {[...Array.from(groupedMessages.entries())]
                .reverse()
                .map(([date, messages]) => (
                    <div key={date} className="flex flex-col-reverse gap-2">
                        <div
                            className={cn(
                                "sticky -top-full order-1 flex items-center justify-center py-5 text-sm transition-all ease-in-out",
                                { "top-0": isSticky }
                            )}
                        >
                            <p className="rounded-md bg-default-200 p-2 py-1 text-gray-200">
                                {new Date(date).getTime() >=
                                    new Date().setHours(0, 0, 0, 0) &&
                                new Date(date).getTime() <
                                    new Date().setHours(23, 59, 59, 999)
                                    ? "Today"
                                    : new Date(date).getTime() >=
                                          new Date(
                                              new Date().setDate(
                                                  new Date().getDate() - 1
                                              )
                                          ).setHours(0, 0, 0, 0) &&
                                      new Date(date).getTime() <
                                          new Date(
                                              new Date().setDate(
                                                  new Date().getDate() - 1
                                              )
                                          ).setHours(23, 59, 59, 999)
                                    ? "Yesterday"
                                    : formatTimestampIntoDate(
                                          new Date(date).getTime()
                                      )}
                            </p>
                        </div>

                        {messages.map((message, index) => {
                            const isCurrentUser = message.senderId === userId;

                            const hasNextMessageFromSameSender =
                                messages[index - 1]?.senderId ===
                                messages[index].senderId;

                            return (
                                <div
                                    key={`${message.id}-${message.timestamp}`}
                                    ref={
                                        index === messages.length - 1
                                            ? scrollDownRef
                                            : null
                                    }
                                >
                                    <div
                                        className={cn("flex items-end gap-2", {
                                            "justify-end": isCurrentUser,
                                        })}
                                    >
                                        <div
                                            className={cn(
                                                "mx-2 flex max-w-[15rem] flex-col gap-2 text-sm md:max-w-xl md:text-base",
                                                {
                                                    "order-1 items-end":
                                                        isCurrentUser,
                                                    "order-2 items-start":
                                                        !isCurrentUser,
                                                }
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "flex items-end gap-2 rounded-lg px-4 py-2 text-white",
                                                    {
                                                        "bg-indigo-600":
                                                            isCurrentUser &&
                                                            !message.text.includes(
                                                                "```"
                                                            ),
                                                        "bg-stone-700":
                                                            !isCurrentUser &&
                                                            !message.text.includes(
                                                                "```"
                                                            ),
                                                        "rounded-br-none":
                                                            !hasNextMessageFromSameSender &&
                                                            isCurrentUser,
                                                        "rounded-bl-none":
                                                            !hasNextMessageFromSameSender &&
                                                            !isCurrentUser,
                                                        "flex-col gap-0":
                                                            message.text
                                                                .length > 100,
                                                        "p-0": message.text.includes(
                                                            "```"
                                                        ),
                                                    }
                                                )}
                                            >
                                                <div className="overscroll-x-scroll max-w-[15rem] md:max-w-xl">
                                                    <ChatMdx>
                                                        {message.text}
                                                    </ChatMdx>
                                                </div>
                                                <div
                                                    className={cn(
                                                        "text-xs text-gray-400"
                                                    )}
                                                >
                                                    <p>
                                                        {formatTimestamp(
                                                            message.timestamp
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className={cn("relative h-6 w-6", {
                                                "order-2": isCurrentUser,
                                                "order-1": !isCurrentUser,
                                                invisible:
                                                    hasNextMessageFromSameSender,
                                            })}
                                        >
                                            <Avatar
                                                isBordered
                                                color={
                                                    isCurrentUser
                                                        ? "primary"
                                                        : "default"
                                                }
                                                src={
                                                    isCurrentUser
                                                        ? userImage ??
                                                          DEFAULT_USER_IMAGE.src
                                                        : chatPartner.image ??
                                                          DEFAULT_USER_IMAGE.src
                                                }
                                                alt={
                                                    isCurrentUser
                                                        ? "Your profile picture"
                                                        : `${chatPartner.username}'s profile picture`
                                                }
                                                size="sm"
                                                classNames={{
                                                    base: "h-6 w-6",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
        </section>
    );
}

export default ChatSection;
