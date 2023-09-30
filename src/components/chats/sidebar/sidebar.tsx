"use client";

import { User } from "@/src/lib/drizzle/schema";
import useSidebarStore from "@/src/lib/store/sidebar";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Message } from "@/src/types/chat";
import { Button } from "@nextui-org/react";
import { Icons } from "../../icons/icons";
import SidebarItems from "./sidebar-items";

export interface ChatterWithLastMessage
    extends Pick<User, "id" | "username" | "image"> {
    lastMessage: Message | null;
}

interface PageProps extends DefaultProps {
    chatters: ChatterWithLastMessage[];
}

function SideBar({ className, children, chatters }: PageProps) {
    const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
    const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

    return (
        <div className={cn("flex h-screen", className)}>
            <aside
                className={cn(
                    "flex h-screen flex-col gap-4 overflow-x-hidden border-r bg-background p-5 transition-all ease-in-out",
                    isSidebarOpen ? "w-full p-5 md:w-[300px]" : "w-0 p-0"
                )}
            >
                <div className="flex items-center justify-between gap-2 md:justify-center">
                    <h1 className="text-center text-2xl font-bold">Chats</h1>
                    <Button
                        isIconOnly
                        radius="sm"
                        variant="light"
                        onPress={() => setSidebarOpen(!isSidebarOpen)}
                        className="flex md:hidden"
                    >
                        <Icons.close className="h-4 w-4" />
                    </Button>
                </div>

                <SidebarItems chatters={chatters} />
            </aside>
            <main className="flex-1 overflow-hidden">{children}</main>
        </div>
    );
}

export default SideBar;
