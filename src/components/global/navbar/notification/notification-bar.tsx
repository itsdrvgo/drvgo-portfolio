"use client";

import { cn } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedNotification } from "@/src/types";
import {
    Badge,
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react";
import { Icons } from "../../../icons/icons";
import NotificationBarContent from "./notification-bar-content";
import NotificationMarkAllAsRead from "./notification-mark-all-read";

interface PageProps extends DefaultProps {
    user: ClerkUserWithoutEmail;
    data: ExtendedNotification[];
}

function NotificationBar({ className, data, user, ...props }: PageProps) {
    return (
        <div className={cn("", className)} {...props}>
            <Popover showArrow={true} shouldBlockScroll={true} radius="sm">
                <Badge
                    isInvisible={data.length === 0}
                    content={data.length > 50 ? "50+" : data.length}
                    color="danger"
                    shape="circle"
                >
                    <PopoverTrigger>
                        <Button
                            radius="full"
                            size="sm"
                            isIconOnly
                            as="button"
                            variant="light"
                            startContent={
                                <Icons.notification className="h-5 w-5 text-gray-400" />
                            }
                        />
                    </PopoverTrigger>
                </Badge>

                <PopoverContent className="max-h-96 w-72 px-2">
                    <div className="relative h-full w-full p-2">
                        {data.length > 0 ? (
                            <div className="h-80 overflow-y-scroll">
                                {data.map((notification) => {
                                    return (
                                        <NotificationBarContent
                                            notification={notification}
                                            notifier={notification.notifier}
                                            key={notification.id}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400">
                                No New Notifications Yet
                            </p>
                        )}

                        {data.length > 0 && (
                            <NotificationMarkAllAsRead userId={user.id} />
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default NotificationBar;
