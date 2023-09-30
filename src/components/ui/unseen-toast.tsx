"use client";

import { chatHrefConstructor, cn } from "@/src/lib/utils";
import { Avatar } from "@nextui-org/react";
import { HTMLAttributes } from "react";
import { toast, type Toast } from "react-hot-toast";

interface UnseenChatToastProps extends HTMLAttributes<HTMLDivElement> {
    t: Toast;
    userId: string;
    senderId: string;
    senderImg: string;
    senderUsername: string;
    senderMessage: string;
}

function UnseenChatToast({
    t,
    senderId,
    userId,
    senderImg,
    senderUsername,
    senderMessage,
    ...props
}: UnseenChatToastProps) {
    return (
        <div
            className={cn(
                "pointer-events-auto flex w-full max-w-md rounded-md border bg-background text-white",
                { "animate-enter": t.visible, "animate-leave": !t.visible }
            )}
            {...props}
        >
            <a
                onClick={() => toast.dismiss(t.id)}
                href={`/chats/${chatHrefConstructor(userId, senderId)}`}
                className="w-0 flex-1 p-4"
            >
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <div className="relative h-10 w-10">
                            <Avatar
                                isBordered
                                color="primary"
                                showFallback
                                src={senderImg}
                                alt={`${senderUsername} profile picture`}
                            />
                        </div>
                    </div>

                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">@{senderUsername}</p>
                        <p className="mt-1 text-sm text-gray-300">
                            {senderMessage}
                        </p>
                    </div>
                </div>
            </a>

            <div className="flex border-l border-gray-700">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default UnseenChatToast;
