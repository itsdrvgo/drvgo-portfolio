"use client";

import { Message, User } from "@/src/lib/drizzle/schema";
import useSidebarStore from "@/src/lib/store/sidebar";
import { cn } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedNotification } from "@/src/types";
import { Input } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons } from "../../icons/icons";
import SidebarItems from "./sidebar-items";
import TopbarItems from "./topbar/topbar-items";

export interface ChatterWithLastMessage
    extends Pick<User, "id" | "username" | "image"> {
    lastMessage: Message | null;
}

interface PageProps extends DefaultProps {
    chatters: Pick<User, "id" | "username" | "image">[];
    user: ClerkUserWithoutEmail;
    notifications: ExtendedNotification[];
    lastMessages: (Message | undefined)[];
}

function SideBar({
    className,
    children,
    chatters,
    user,
    notifications,
    lastMessages,
}: PageProps) {
    const searchParams = useSearchParams();
    const pId = searchParams.get("pId");

    const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);

    const [filteredChatters, setFilteredChatters] = useState(chatters);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (searchText.length > 0) {
            setFilteredChatters(
                chatters.filter((chatter) =>
                    chatter.username.includes(searchText)
                )
            );
        } else {
            setFilteredChatters(chatters);
        }
    }, [chatters, searchText]);

    return (
        <div className={cn("flex h-screen", className)}>
            <aside
                className={cn(
                    "absolute left-0 top-0 z-[9999] flex h-screen flex-col gap-4 overflow-x-hidden border-r border-chat-border bg-chat transition-all ease-in-out md:relative",
                    isSidebarOpen
                        ? "w-full max-w-full translate-x-0 md:max-w-xs"
                        : "-translate-x-full"
                )}
            >
                <TopbarItems user={user} notifications={notifications} />

                <div className="px-3">
                    <Input
                        placeholder="Search..."
                        onValueChange={setSearchText}
                        value={searchText}
                        endContent={
                            <Icons.search className="h-4 w-4 text-gray-400" />
                        }
                        classNames={{
                            inputWrapper:
                                "bg-chat-input border border-gray-700 data-[hover=true]:bg-chat-input",
                        }}
                        radius="sm"
                    />
                </div>

                {filteredChatters.length === 0 ? (
                    <div className="flex w-full items-center justify-center">
                        <p className="text-gray-400">No chats found</p>
                    </div>
                ) : (
                    <SidebarItems
                        chatters={filteredChatters}
                        pId={pId}
                        lastMessages={lastMessages}
                        uId={user.id}
                    />
                )}
            </aside>

            <main className="flex-1 overflow-hidden">{children}</main>
        </div>
    );
}

export default SideBar;
