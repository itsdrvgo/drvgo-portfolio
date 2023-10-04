"use client";

import { Mdx } from "@/src/components/md/mdx-comp";
import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { User } from "@/src/lib/drizzle/schema";
import {
    cn,
    convertMstoTimeElapsed,
    markNotificationAsRead,
} from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import {
    CustomNotificationProps,
    Notification,
} from "@/src/types/notification";
import {
    Avatar,
    Button,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PageProps extends DefaultProps {
    notification: Notification;
    notifier: User;
}

function NotificationBarContent({
    className,
    notification,
    notifier,
    ...props
}: PageProps) {
    const router = useRouter();

    const {
        isOpen: isAnnouncementOpen,
        onOpen: onAnnouncementOpen,
        onOpenChange: onAnnouncementOpenChange,
    } = useDisclosure();

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

            case "newProject": {
                router.push(`/projects/${notification.props.projectId}`);
                break;
            }

            case "custom": {
                router.push(`/announcements`);
                break;
            }

            default: {
                toast.error("Something went wrong, try again later!");
                break;
            }
        }
    };

    return (
        <>
            <div
                key={notification.id}
                className={cn(
                    "grid cursor-pointer grid-flow-col items-center gap-4 rounded-md p-2 transition-all ease-in-out hover:bg-gray-800",
                    className
                )}
                onClick={handleNotificationClick}
                {...props}
            >
                <Avatar
                    isBordered
                    showFallback
                    as="span"
                    size="md"
                    src={notifier.image || DEFAULT_USER_IMAGE.src}
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
                            <span className="font-semibold text-gray-400">
                                {notification.props.commentContent.length > 50
                                    ? notification.props.commentContent
                                          .slice(0, 50)
                                          .concat("...")
                                    : notification.props.commentContent}
                            </span>
                        )}
                        {(notification.props.type === "blogCommentReply" ||
                            notification.props.type ===
                                "blogCommentReplyLove") && (
                            <span className="font-semibold text-gray-400">
                                {notification.props.replyContent.length > 50
                                    ? notification.props.replyContent
                                          .slice(0, 50)
                                          .concat("...")
                                    : notification.props.replyContent}
                            </span>
                        )}
                        {notification.props.type === "newProject" && (
                            <span className="font-semibold text-gray-400">
                                {notification.props.projectTitle.length > 50
                                    ? notification.props.projectTitle
                                          .slice(0, 50)
                                          .concat("...")
                                    : notification.props.projectTitle}
                            </span>
                        )}
                        {notification.props.type === "custom" && (
                            <span className="font-semibold text-gray-400">
                                {notification.props.content.length > 50
                                    ? notification.props.content
                                          .slice(0, 50)
                                          .concat("...")
                                    : notification.props.content}
                            </span>
                        )}
                    </p>
                    <p className="text-xs">
                        {convertMstoTimeElapsed(
                            notification.createdAt.getTime()
                        )}
                    </p>
                </div>
            </div>

            <Modal
                isOpen={isAnnouncementOpen}
                onOpenChange={onAnnouncementOpenChange}
            >
                <ModalContent className="z-[99999]">
                    {(onClose) => {
                        const notificationProps =
                            notification.props as CustomNotificationProps;

                        return (
                            <>
                                <ModalHeader>
                                    {notificationProps.title}
                                </ModalHeader>
                                <ModalBody>
                                    {notificationProps.imageUrl && (
                                        <Image
                                            src={notificationProps.imageUrl}
                                            alt="Notification image"
                                            radius="sm"
                                            as={NextImage}
                                            className="h-full w-full"
                                            width={1000}
                                            height={1000}
                                        />
                                    )}

                                    <Mdx>{notificationProps.content}</Mdx>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        radius="sm"
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                        className="font-semibold"
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        radius="sm"
                                        color="primary"
                                        onPress={() => {
                                            markNotificationAsRead({
                                                notificationId: notification.id,
                                                userId: notification.userId!,
                                            });
                                            onClose();
                                            router.refresh();
                                        }}
                                        className="font-semibold"
                                    >
                                        Mark as Read
                                    </Button>
                                </ModalFooter>
                            </>
                        );
                    }}
                </ModalContent>
            </Modal>
        </>
    );
}

export default NotificationBarContent;
