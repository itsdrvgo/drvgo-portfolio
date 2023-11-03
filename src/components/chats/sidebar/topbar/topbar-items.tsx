"use client";

import NotificationBar from "@/src/components/global/navbar/notification/notification-bar";
import DropdownProfile from "@/src/components/global/navbar/profile/dropdown-profile";
import { Icons } from "@/src/components/icons/icons";
import useSidebarStore from "@/src/lib/store/sidebar";
import { cn } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedNotification } from "@/src/types";
import { Button } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";

interface PageProps extends DefaultProps {
    user: ClerkUserWithoutEmail;
    notifications: ExtendedNotification[];
}

function TopbarItems({ className, user, notifications, ...props }: PageProps) {
    const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
    const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

    const searchParams = useSearchParams();
    const uId = searchParams.get("uId");
    const pId = searchParams.get("pId");

    return (
        <div
            className={cn(
                "flex h-[4.5rem] items-center justify-between gap-5 border-b border-chat-border p-5 px-8",
                className
            )}
            {...props}
        >
            <DropdownProfile user={user} />

            <div className="flex items-center gap-4">
                <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    startContent={
                        <Icons.chatPlus className="h-5 w-5 text-gray-400" />
                    }
                />
                <NotificationBar data={notifications} user={user} />

                <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    radius="full"
                    className={cn("md:hidden", 
                        !uId && !pId && "hidden"
                    )}
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
            </div>
        </div>
    );
}

export default TopbarItems;
