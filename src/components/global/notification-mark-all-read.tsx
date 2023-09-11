"use client";

import { cn, markNotificationAsRead } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

interface PageProps extends DefaultProps {
    userId: string;
}

function NotificationMarkAllAsRead({ className, userId }: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const handleMarkAllAsRead = () => {
        markNotificationAsRead({
            userId,
        })
            .then(() => {
                router.refresh();

                toast({
                    description: "Marked all notifications as read",
                });
            })
            .catch((err) => {
                console.log(err);

                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <div
            className={cn(
                "absolute bottom-0 left-0 w-full cursor-pointer rounded-b-md border-t border-border p-2 py-3 text-center text-sm",
                className
            )}
            onClick={handleMarkAllAsRead}
        >
            <p>Mark all as Read</p>
        </div>
    );
}

export default NotificationMarkAllAsRead;
