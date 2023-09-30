"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { pusherClient } from "@/src/lib/pusher/client";
import { chatHrefConstructor, cn, toPusherKey } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Message } from "@/src/types/chat";
import { useAuth } from "@clerk/nextjs";
import {
    Avatar,
    Divider,
    Listbox,
    ListboxItem,
    ScrollShadow,
} from "@nextui-org/react";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UnseenChatToast from "../../ui/unseen-toast";
import { ChatterWithLastMessage } from "./sidebar";

export interface ExtendedMessage extends Message {
    senderImg: string;
    senderUsername: string;
}

interface PageProps extends DefaultProps {
    chatters: ChatterWithLastMessage[];
}

function SidebarItems({ chatters }: PageProps) {
    const router = useRouter();
    const pathname = usePathname();

    const { userId } = useAuth();
    if (!userId) notFound();

    const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
    const [sortedChatters, setSortedChatters] = useState(chatters);

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${userId}:chats`));

        const chatHandler = (message: ExtendedMessage) => {
            const shouldNotify =
                pathname !==
                `/chats/${chatHrefConstructor(userId, message.senderId)}`;

            setSortedChatters((prev) => {
                const filtered = prev.filter(
                    (chatter) => chatter.id !== message.senderId
                );

                return [
                    {
                        id: message.senderId,
                        username: message.senderUsername,
                        image: message.senderImg,
                        lastMessage: message,
                    },
                    ...filtered,
                ];
            });

            if (!shouldNotify) return;

            toast.custom((t) => (
                <UnseenChatToast
                    t={t}
                    userId={userId}
                    senderId={message.senderId}
                    senderImg={message.senderImg}
                    senderUsername={message.senderUsername}
                    senderMessage={message.text}
                />
            ));

            setUnseenMessages((prev) => [...prev, message]);
        };

        pusherClient.bind("new_message", chatHandler);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${userId}:chats`));
            pusherClient.unbind("new_message", chatHandler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, pathname, router]);

    useEffect(() => {
        if (pathname?.includes("chats")) {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathname.includes(msg.senderId));
            });
        }
    }, [pathname]);

    return (
        <>
            <Divider />

            <ScrollShadow isEnabled={false}>
                <Listbox
                    itemClasses={{
                        base: "p-3",
                    }}
                    onAction={(key) => {
                        router.push(
                            `/chats/${chatHrefConstructor(
                                key as string,
                                userId
                            )}`
                        );
                    }}
                >
                    {sortedChatters.map((chatter) => {
                        const unseenMessageCount = unseenMessages.filter(
                            (msg) => msg.senderId === chatter.id
                        ).length;

                        return (
                            <ListboxItem
                                key={chatter.id}
                                startContent={
                                    <Avatar
                                        isBordered
                                        color="success"
                                        src={
                                            chatter.image ??
                                            DEFAULT_USER_IMAGE.src
                                        }
                                        alt={chatter.username}
                                        showFallback
                                        size="sm"
                                    />
                                }
                                aria-label={chatter.username}
                                textValue={chatter.id}
                            >
                                @{chatter.username}
                                <span>
                                    {unseenMessageCount > 0 &&
                                        ` (${unseenMessageCount})`}
                                </span>
                            </ListboxItem>
                        );
                    })}
                </Listbox>
            </ScrollShadow>
        </>
    );
}

export default SidebarItems;
