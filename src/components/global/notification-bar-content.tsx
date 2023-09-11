"use client";

import { defaultUserPFP } from "@/src/config/const";
import { User } from "@/src/lib/drizzle/schema";
import {
    cn,
    convertMstoTimeElapsed,
    markNotificationAsRead,
} from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Notification } from "@/src/types/notification";
import { Avatar } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

interface PageProps extends DefaultProps {
    notification: Notification;
    notifier: User;
}

function NotificationBarContent({
    className,
    notification,
    notifier,
}: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const handleNotificationClick = () => {
        markNotificationAsRead({
            notificationId: notification.id,
            userId: notification.userId!,
        });

        switch (notification.props.type) {
            case "blogLike": {
                router.push(`/blogs/${notification.props.blogId}`);
                break;
            }

            case "blogComment": {
                router.push(
                    `/blogs/${notification.props.blogId}?commentId=${notification.props.commentId}`
                );
                break;
            }

            case "blogCommentReply": {
                router.push(
                    `/blogs/${notification.props.blogId}?replyId=${notification.props.replyId}`
                );
                break;
            }

            case "newBlog": {
                router.push(`/blogs/${notification.props.blogId}`);
                break;
            }

            case "blogCommentLove": {
                router.push(
                    `/blogs/${notification.props.blogId}?commentId=${notification.props.commentId}`
                );
                break;
            }

            case "blogCommentReplyLove": {
                router.push(
                    `/blogs/${notification.props.blogId}?replyId=${notification.props.replyId}`
                );
                break;
            }

            case "blogCommentPin": {
                router.push(
                    `/blogs/${notification.props.blogId}?commentId=${notification.props.commentId}`
                );
                break;
            }

            default: {
                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
                break;
            }
        }
    };

    return (
        <div
            key={notification.id}
            className={cn(
                "grid cursor-pointer grid-flow-col items-center gap-4 rounded-md p-2 transition-all ease-in-out hover:bg-gray-800",
                className
            )}
            onClick={handleNotificationClick}
        >
            <Avatar
                isBordered
                showFallback
                as="span"
                size="md"
                src={notifier.image || defaultUserPFP.src}
            />
            <div className="space-y-2">
                <p className="text-sm">
                    {notification.content} :{" "}
                    {(notification.props.type === "newBlog" ||
                        notification.props.type === "blogLike") && (
                        <span className="font-semibold text-gray-300">
                            {notification.props.blogTitle.length > 50
                                ? notification.props.blogTitle
                                      .slice(0, 50)
                                      .concat("...")
                                : notification.props.blogTitle}
                        </span>
                    )}
                    {(notification.props.type === "blogComment" ||
                        notification.props.type === "blogCommentLove" ||
                        notification.props.type === "blogCommentPin") && (
                        <span className="font-semibold text-gray-300">
                            {notification.props.commentContent.length > 50
                                ? notification.props.commentContent
                                      .slice(0, 50)
                                      .concat("...")
                                : notification.props.commentContent}
                        </span>
                    )}
                    {(notification.props.type === "blogCommentReply" ||
                        notification.props.type === "blogCommentReplyLove") && (
                        <span className="font-semibold text-gray-300">
                            {notification.props.replyContent.length > 50
                                ? notification.props.replyContent
                                      .slice(0, 50)
                                      .concat("...")
                                : notification.props.replyContent}
                        </span>
                    )}
                </p>
                <p className="text-xs">
                    {convertMstoTimeElapsed(notification.createdAt.getTime())}
                </p>
            </div>
        </div>
    );
}

export default NotificationBarContent;
