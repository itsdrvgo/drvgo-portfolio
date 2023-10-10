"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import useSidebarStore from "@/src/lib/store/sidebar";
import { cn } from "@/src/lib/utils";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedNotification } from "@/src/types";
import { CachedUser } from "@/src/types/cache";
import { Button, User } from "@nextui-org/react";
import Auth from "../global/navbar/profile/auth";
import { Icons } from "../icons/icons";

interface PageProps extends DefaultProps {
    user: ClerkUser;
    partner?: CachedUser;
    data: ExtendedNotification[];
}

function ChatsNavbar({ className, data, user, partner, ...props }: PageProps) {
    const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
    const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

    return (
        <header
            className={cn(
                "flex items-center justify-between border-b bg-background p-4 md:px-10 md:pl-4",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-4">
                <Button
                    isIconOnly
                    radius="sm"
                    size="sm"
                    variant="shadow"
                    onPress={() => setSidebarOpen(!isSidebarOpen)}
                >
                    <Icons.chevronLeft
                        className={cn(
                            "h-5 w-5 transition-all ease-in-out",
                            !isSidebarOpen && "rotate-180"
                        )}
                    />
                </Button>

                {partner && (
                    <User
                        avatarProps={{
                            src: partner.image ?? DEFAULT_USER_IMAGE.src,
                            size: "sm",
                        }}
                        name={"@" + partner.username}
                        className="cursor-default"
                    />
                )}
            </div>

            <nav className="flex gap-5">
                <Auth user={user} notifications={data} />
            </nav>
        </header>
    );
}

export default ChatsNavbar;
