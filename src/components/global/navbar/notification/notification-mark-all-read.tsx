"use client";

import { markAllNotificationsAsRead } from "@/src/actions/notifications";
import { cn, handleClientError } from "@/src/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";
import toast from "react-hot-toast";

interface PageProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    userId: string;
}

function NotificationMarkAllAsRead({ className, userId, ...props }: PageProps) {
    const router = useRouter();

    const { mutate: handleMarkAllAsRead, isLoading } = useMutation({
        onMutate() {
            const toastId = toast.loading("Marking all as read...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            await markAllNotificationsAsRead({
                userId,
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Marked all notifications as read", {
                id: ctx?.toastId,
            });
            router.refresh();
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
        },
    });

    return (
        <button
            className={cn(
                "absolute bottom-0 left-0 w-full cursor-pointer rounded-b-md border-t border-border p-2 py-3 text-center text-sm",
                className
            )}
            disabled={isLoading}
            onClick={() => handleMarkAllAsRead()}
            {...props}
        >
            <p>Mark all as Read</p>
        </button>
    );
}

export default NotificationMarkAllAsRead;
