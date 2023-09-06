import { db } from "@/src/lib/drizzle";
import { User, users } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { Notification } from "@/src/types/notification";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { eq } from "drizzle-orm";
import { Icons } from "../icons/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import NotificationBarContent from "./notification-bar-content";
import NotificationMarkAllAsRead from "./notification-mark-all-read";

interface PageProps extends DefaultProps {
    user: ClerkUser;
    data: Notification[];
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
                                const { data } = await axios.get<ResponseData>(
                                    `/api/users/${notification.notifierId}`
                                );

                                if (data.code !== 200) return null;
                                const notifier = JSON.parse(data.data) as User;

                                return (
                                    <NotificationBarContent
                                        notification={notification}
                                        notifier={notifier}
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
