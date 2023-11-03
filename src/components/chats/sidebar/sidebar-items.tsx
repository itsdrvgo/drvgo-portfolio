"use client";

import { Message, User } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
import { Divider, ScrollShadow } from "@nextui-org/react";
import SideBarItem from "./sidebar-item";

export interface ExtendedMessage extends Message {
    senderImg: string;
    senderUsername: string;
}

interface PageProps extends DefaultProps {
    chatters: Pick<User, "id" | "username" | "image">[];
    pId: string | null;
    uId: string;
    lastMessages: (Message | undefined)[];
}

function SidebarItems({ chatters, pId, uId, lastMessages }: PageProps) {
    return (
        <ScrollShadow isEnabled={false}>
            {chatters.map((chatter, index) => {
                const message = lastMessages?.find(
                    (m) =>
                        m?.senderId === chatter.id ||
                        m?.receiverId === chatter.id
                );

                return (
                    <SideBarItem
                        key={chatter.id}
                        chatter={chatter}
                        index={index}
                        message={message}
                        pId={pId}
                        uId={uId}
                    />
                );
            })}

            <div className="my-3 px-5">
                <Divider />
            </div>
        </ScrollShadow>
    );
}

export default SidebarItems;
