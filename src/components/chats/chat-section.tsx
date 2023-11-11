"use client";

import { Message } from "@/src/lib/drizzle/schema";
import {
    cn,
    formatTimestampIntoDate,
    formatTimestampIntoHourMinute,
} from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Button } from "@nextui-org/react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icons } from "../icons/icons";
import { ChatMdx } from "../md/mdx-comp";

function groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
    const groups = new Map<string, Message[]>();

    messages.forEach((message) => {
        const date = new Date(message.sentAt);
        const dateString = date.toDateString();

        if (groups.has(dateString)) groups.get(dateString)?.push(message);
        else groups.set(dateString, [message]);
    });

    return groups;
}

interface PageProps extends DefaultProps {
    userId: string;
    messages: Message[];
    pendingMessages: string[];
}

function ChatSection({
    className,
    userId,
    messages,
    pendingMessages,
    ...props
}: PageProps) {
    const [isSticky, setIsSticky] = useState(false);
    const [scrollButtonIsVisible, setScrollButtonIsVisible] = useState(false);
    const [isPressed, setIsPressed] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, pendingMessages]);

    const { scrollY } = useScroll({
        container: scrollRef,
    });

    useMotionValueEvent(scrollY, "change", (latest) => {
        latest > 0 ? setIsSticky(true) : setIsSticky(false);

        const isScrolling =
            scrollRef.current?.scrollHeight! -
                scrollRef.current?.scrollTop! -
                200 <
            scrollRef.current?.clientHeight!;

        setScrollButtonIsVisible(!isScrolling);
    });

    useEffect(() => {
        setTimeout(() => {
            setIsSticky(false);
        }, 5000);
    }, [isSticky]);

    const groupedMessages = groupMessagesByDate(messages);
    const lastMessageFromSender = messages.filter(
        (msg) => msg.senderId === userId
    )[0];

    return (
        <section
            className={cn("z-50 h-full overflow-y-auto px-4 pb-4", className)}
            ref={scrollRef}
            {...props}
        >
            {[...Array.from(groupedMessages.entries())]
                .reverse()
                .map(([date, msgs]) => {
                    return (
                        <div key={date} className="flex flex-col-reverse gap-2">
                            <div ref={messagesEndRef} />

                            <div
                                className={cn(
                                    "pointer-events-none sticky -top-full order-1 flex items-center justify-center py-5 text-sm transition-all ease-in-out",
                                    { "top-0": isSticky }
                                )}
                            >
                                <p className="rounded-lg bg-default-200 p-2 py-1 text-sm text-gray-200">
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

                            {msgs.map((message, index) => {
                                const isCurrentUser =
                                    message.senderId === userId;

                                const hasNextMessageFromSameSender =
                                    msgs[index - 1]?.senderId ===
                                    msgs[index].senderId;

                                return (
                                    <div
                                        key={`${message.id}-${message.sentAt}`}
                                    >
                                        <div
                                            className={cn(
                                                "flex items-end gap-2",
                                                {
                                                    "justify-end":
                                                        isCurrentUser,
                                                }
                                            )}
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
                                                    onClick={() => {
                                                        if (
                                                            isPressed ===
                                                            message.id
                                                        )
                                                            setIsPressed(null);
                                                        else
                                                            setIsPressed(
                                                                message.id
                                                            );
                                                    }}
                                                    className={cn(
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
                                                            "rounded-br-none":
                                                                !hasNextMessageFromSameSender &&
                                                                isCurrentUser,
                                                            "rounded-bl-none":
                                                                !hasNextMessageFromSameSender &&
                                                                !isCurrentUser,
                                                        }
                                                    )}
                                                >
                                                    <div className="overscroll-x-scroll max-w-[15rem] md:max-w-xl">
                                                        <ChatMdx>
                                                            {message.text}
                                                        </ChatMdx>
                                                    </div>
                                                </div>

                                                <div
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
                                                    <p className="flex items-center gap-1">
                                                        <span>
                                                            {formatTimestampIntoHourMinute(
                                                                message.seenAt
                                                                    ? new Date(
                                                                          message.seenAt
                                                                      ).getTime()
                                                                    : new Date(
                                                                          message.sentAt
                                                                      ).getTime()
                                                            )}
                                                        </span>
                                                        <span
                                                            className={cn(
                                                                "hidden",
                                                                lastMessageFromSender.id ===
                                                                    message.id &&
                                                                    "inline-block",
                                                                isPressed ===
                                                                    message.id &&
                                                                    isCurrentUser &&
                                                                    "inline-block"
                                                            )}
                                                        >
                                                            {"\u2022"}
                                                        </span>
                                                        <span
                                                            className={cn(
                                                                "hidden",
                                                                lastMessageFromSender.id ===
                                                                    message.id &&
                                                                    "inline-block",
                                                                isPressed ===
                                                                    message.id &&
                                                                    isCurrentUser &&
                                                                    "inline-block"
                                                            )}
                                                        >
                                                            {message.status ===
                                                            "seen"
                                                                ? "Seen"
                                                                : "Sent"}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

            <div className="flex flex-col gap-2">
                {pendingMessages.map((message, index) => {
                    const isLastMessage = index === pendingMessages.length - 1;

                    return (
                        <div key={index}>
                            <div
                                className={cn("flex items-end gap-2", {
                                    "justify-end": true,
                                })}
                            >
                                <div
                                    className={cn(
                                        "order-1 mx-2 flex max-w-[15rem] flex-col items-end gap-2 text-sm md:max-w-xl md:text-base"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex items-end gap-2 rounded-2xl rounded-br-none bg-primary-400 px-4 py-2 text-white opacity-60",
                                            {
                                                "flex-col gap-0":
                                                    message.length > 100,
                                                "p-0": message.includes("```"),
                                            }
                                        )}
                                    >
                                        <div className="overscroll-x-scroll max-w-[15rem] md:max-w-xl">
                                            <ChatMdx>{message}</ChatMdx>
                                        </div>
                                    </div>

                                    <p
                                        className={cn("text-xs text-gray-400", {
                                            hidden: !isLastMessage,
                                        })}
                                    >
                                        Sending
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div ref={messagesEndRef} />
            </div>

            <Button
                className={cn("fixed bottom-20 right-5 bg-default-200", {
                    hidden: !scrollButtonIsVisible,
                })}
                variant="shadow"
                radius="full"
                onPress={() => {
                    messagesEndRef.current?.scrollIntoView({
                        behavior: "smooth",
                    });
                }}
                isIconOnly
                startContent={<Icons.chevronDown className="h-4 w-4" />}
            />
        </section>
    );
}

export default ChatSection;
