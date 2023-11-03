"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { Message, User } from "@/src/lib/drizzle/schema";
import useSidebarStore from "@/src/lib/store/sidebar";
import { chatParamsGenerator, cn } from "@/src/lib/utils";
import { Avatar } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { DetailedHTMLProps, HTMLAttributes } from "react";

interface PageProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    chatter: Pick<User, "id" | "username" | "image">;
    pId: string | null;
    uId: string;
    message: Message | undefined;
    index: number;
}

function SideBarItem({
    chatter,
    pId,
    uId,
    message,
    index,
    key,
    ...props
}: PageProps) {
    const router = useRouter();
    const pathname = usePathname();

    const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
    const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

    if (typeof window === undefined) return null;
    const isMobile = window.innerWidth <= 768;

    return (
        <div
            key={key}
            className={cn(
                "flex cursor-pointer items-center gap-4 px-5 hover:bg-chat-hover",
                pId === chatter.id && "bg-chat-hover"
            )}
            onClick={() => {
                setSidebarOpen(isMobile ? false : isSidebarOpen);
                router.push(
                    pathname + "?" + chatParamsGenerator(chatter.id, uId)
                );
            }}
            {...props}
        >
            <div className="py-3">
                <Avatar
                    src={chatter.image ?? DEFAULT_USER_IMAGE.src}
                    alt={chatter.username}
                    showFallback
                />
            </div>

            <div
                className={cn(
                    "flex w-full flex-col gap-[2px] border-t border-chat-hover py-3",
                    index === 0 && "border-t-0"
                )}
            >
                <p>@{chatter.username}</p>

                {message ? (
                    <p className="text-sm text-gray-400">
                        Chat with @{chatter.username}
                    </p>
                ) : (
                    <p className="text-sm text-gray-400">No messages yet</p>
                )}
            </div>
        </div>
    );
}

export default SideBarItem;
