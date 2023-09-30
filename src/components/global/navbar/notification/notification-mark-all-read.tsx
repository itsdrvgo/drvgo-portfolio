"use client";

import { cn, markNotificationAsRead } from "@/src/lib/utils";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";
import toast from "react-hot-toast";

interface PageProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    userId: string;
}

function NotificationMarkAllAsRead({ className, userId, ...props }: PageProps) {
    const router = useRouter();

    const handleMarkAllAsRead = () => {
        markNotificationAsRead({
            userId,
        })
            .then(() => {
                toast.success("Marked all notifications as read");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!");
            })
            .finally(() => router.refresh());
    };

    return (
        <button
            className={cn(
                "absolute bottom-0 left-0 w-full cursor-pointer rounded-b-md border-t border-border p-2 py-3 text-center text-sm",
                className
            )}
            onClick={handleMarkAllAsRead}
            {...props}
        >
            <p>Mark all as Read</p>
        </button>
    );
}

export default NotificationMarkAllAsRead;
