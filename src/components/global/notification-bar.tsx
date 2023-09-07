import { cn } from "@/src/lib/utils";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedNotification } from "@/src/types";
import { Icons } from "../icons/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import NotificationBarContent from "./notification-bar-content";
import NotificationMarkAllAsRead from "./notification-mark-all-read";

interface PageProps extends DefaultProps {
    user: ClerkUser;
    data: ExtendedNotification[];
}

function NotificationBar({ className, data, user }: PageProps) {
    return (
        <div className={cn("", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <div className="cursor-pointer rounded-md border border-gray-700 p-2 text-sky-400">
                        <Icons.notification
                            className={cn(
                                "h-4 w-4",
                                data.length > 0 && "fill-sky-400"
                            )}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className={cn(
                        "relative mr-2 max-h-96 w-72 overflow-hidden p-0 md:w-80",
                        data.length > 0 ? "pb-14" : "pb-0"
                    )}
                >
                    <div
                        className={cn(
                            "flex max-h-80 flex-col items-center gap-2 p-2",
                            data.length > 0 && "overflow-y-scroll"
                        )}
                    >
                        {data.length > 0 ? (
                            data.map(async (notification) => {
                                return (
                                    <NotificationBarContent
                                        notification={notification}
                                        notifier={notification.notifier}
                                        key={notification.id}
                                    />
                                );
                            })
                        ) : (
                            <p className="text-center">
                                No notifications yet. Check back later
                            </p>
                        )}
                    </div>

                    {data.length > 0 && (
                        <NotificationMarkAllAsRead userId={user.id} />
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default NotificationBar;
