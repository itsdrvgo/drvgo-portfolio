"use client";

import { pusherClient } from "@/src/lib/pusher/client";
import {
    cn,
    formatTimestampIntoDate,
    formatTimestampIntoHourMinute,
    toPusherKey,
} from "@/src/lib/utils";
import { Message } from "@/src/lib/validation/messages";
import { DefaultProps, UserWithAccount } from "@/src/types";
import { Card, CardBody } from "@nextui-org/react";
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

    const [isPressed, setIsPressed] = useState<string | null>(null);

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
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const { scrollY } = useScroll({
        container: scrollRef,
    });

    useMotionValueEvent(scrollY, "change", (latest) => {
        latest > 0 ? setIsSticky(true) : setIsSticky(false);
    });

    useEffect(() => {
        setTimeout(() => {
            setIsSticky(false);
        }, 5000);
    }, [isSticky]);

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
                        <div ref={messagesEndRef} />

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
                                <div key={`${message.id}-${message.timestamp}`}>
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
                                            <Card
                                                isPressable
                                                onPress={() => {
                                                    if (
                                                        isPressed === message.id
                                                    )
                                                        setIsPressed(null);
                                                    else
                                                        setIsPressed(
                                                            message.id
                                                        );
                                                }}
                                                classNames={{
                                                    base: cn({
                                                        "bg-primary-400":
                                                            isCurrentUser &&
                                                            !message.text.includes(
                                                                "```"
                                                            ),
                                                        "bg-default-200":
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
                                                    }),
                                                    body: cn(
                                                        "flex items-end gap-2 rounded-2xl px-4 py-2 text-white",
                                                        {
                                                            "bg-primary-400":
                                                                isCurrentUser &&
                                                                !message.text.includes(
                                                                    "```"
                                                                ),
                                                            "bg-default-200":
                                                                !isCurrentUser &&
                                                                !message.text.includes(
                                                                    "```"
                                                                ),
                                                            "flex-col gap-0":
                                                                message.text
                                                                    .length >
                                                                100,
                                                            "p-0": message.text.includes(
                                                                "```"
                                                            ),
                                                        }
                                                    ),
                                                }}
                                            >
                                                <CardBody>
                                                    <div className="overscroll-x-scroll max-w-[15rem] md:max-w-xl">
                                                        <ChatMdx>
                                                            {message.text}
                                                        </ChatMdx>
                                                    </div>
                                                </CardBody>
                                            </Card>

                                            <p
                                                className={cn(
                                                    "text-xs text-gray-400",
                                                    {
                                                        hidden:
                                                            hasNextMessageFromSameSender &&
                                                            message.id !==
                                                                isPressed,
                                                    }
                                                )}
                                            >
                                                {formatTimestampIntoHourMinute(
                                                    message.timestamp
                                                )}
                                            </p>
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
