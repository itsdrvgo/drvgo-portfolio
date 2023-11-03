"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import useSidebarStore from "@/src/lib/store/sidebar";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { CachedUser } from "@/src/types/cache";
import { Button, User } from "@nextui-org/react";
import { Icons } from "../icons/icons";

interface PageProps extends DefaultProps {
    partner?: CachedUser;
}

function ChatsNavbar({ className, partner, ...props }: PageProps) {
    const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
    const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

    return (
        <header
            className={cn(
                "flex h-[4.5rem] items-center justify-between border-b border-chat-border bg-chat p-5",
                className
            )}
            {...props}
        >
            <Button
                isIconOnly
                variant="light"
                size="sm"
                radius="full"
                className="md:hidden"
                startContent={
                    <Icons.chevronLeft
                        className={cn(
                            "text-gray-500 transition-all ease-in-out",
                            !isSidebarOpen && "rotate-180"
                        )}
                    />
                }
                onPress={() => setSidebarOpen(!isSidebarOpen)}
            />

            {partner && (
                <User
                    avatarProps={{
                        src: partner.image ?? DEFAULT_USER_IMAGE.src,
                    }}
                    name={"@" + partner.username}
                    className="cursor-default font-semibold"
                />
            )}

            <Button
                isIconOnly
                radius="full"
                variant="light"
                startContent={
                    <Icons.moreVert className="h-5 w-5 text-gray-200" />
                }
            />
        </header>
    );
}

export default ChatsNavbar;
