"use client";

import { NewComment } from "@/src/lib/drizzle/schema";
import { addNotification, cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedComment } from "@/src/types";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Icons } from "../icons/icons";
import { useToast } from "../ui/use-toast";

interface PageProps extends DefaultProps {
    user: ClerkUser;
    params: {
        blogId: string;
    };
    comment: ExtendedComment;
}

function BlogCommentOperation({ user, params, comment }: PageProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [isPinned, setIsPinned] = useState(comment.pinned);
    const [isEditing, setIsEditing] = useState(false);
    const [commentText, setCommentText] = useState(comment.content);
    const [isPosting, setIsPosting] = useState(false);

    const {
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onOpenChange: onDeleteModalOpenChange,
        onClose: onDeleteModalClose,
    } = useDisclosure();

    const {
        isOpen: isEditModalOpen,
        onOpen: onEditModalOpen,
        onOpenChange: onEditModalOpenChange,
        onClose: onEditModalClose,
    } = useDisclosure();

    useEffect(() => {
        if (commentText === comment.content) setIsEditing(false);
        else setIsEditing(true);
    }, [comment.content, commentText]);

    const handleCommentDelete = () => {
        axios
            .delete<ResponseData>(
                `/api/blogs/comments/${params.blogId}/${comment.id}`
            )
            .then(({ data: resData }) => {
                onDeleteModalClose();

                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                router.refresh();
                toast({
                    description: "Comment deleted",
                });
            })
            .catch((err) => {
                onDeleteModalClose();

                console.log(err);
                return toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    const handleCommentPin = () => {
        axios
            .post<ResponseData>(
                `/api/blogs/comments/${params.blogId}/${comment.id}/${
                    isPinned ? "unpin" : "pin"
                }`
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                setIsPinned(!isPinned);
                toast({
                    description: `Comment ${isPinned ? "unpinned" : "pinned"}`,
                });

                if (!isPinned) {
                    addNotification({
                        userId: comment.authorId,
                        notifierId: user.id,
                        title: "Comment Pinned",
                        content: `Your comment on '${comment.blog.title}' has been pinned`,
                        props: {
                            type: "blogCommentPin",
                            blogId: comment.blogId,
                            commentId: comment.id,
                            blogThumbnailUrl: comment.blog.thumbnailUrl!,
                            commentContent: comment.content,
                        },
                    });
                }

                router.refresh();
            })
            .catch((err) => {
                console.log(err);
                return toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    const handleCommentEdit = async () => {
        setIsPosting(true);
        setIsEditing(false);

        const body: Pick<NewComment, "content"> = {
            content: commentText,
        };

        axios
            .patch<ResponseData>(
                `/api/blogs/comments/${params.blogId}/${comment.id}`,
                JSON.stringify(body)
            )
            .then(({ data: resData }) => {
                onEditModalClose();

                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: "Comment updated",
                });
            })
            .catch((err) => {
                onEditModalClose();

                console.log(err);
                return toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            })
            .finally(() => {
                setIsPosting(false);
                router.refresh();
            });
    };

    return (
        <>
            <Dropdown radius="sm">
                <DropdownTrigger>
                    {["admin", "owner"].includes(user.privateMetadata.role) ? (
                        <Button
                            isIconOnly
                            variant="bordered"
                            radius="sm"
                            size="sm"
                        >
                            <Icons.moreVert className="h-4 w-4" />
                        </Button>
                    ) : user.id === comment.authorId ? (
                        <Button
                            isIconOnly
                            variant="bordered"
                            radius="sm"
                            size="sm"
                        >
                            <Icons.moreVert className="h-4 w-4" />
                        </Button>
                    ) : null}
                </DropdownTrigger>
                <DropdownMenu
                    itemClasses={{
                        base: "rounded-sm",
                    }}
                >
                    <DropdownSection showDivider title={"Action"}>
                        <DropdownItem
                            className={cn(
                                comment.parentId === null &&
                                    ["admin", "owner"].includes(
                                        user.privateMetadata.role
                                    )
                                    ? "visible"
                                    : "hidden"
                            )}
                            startContent={
                                <Icons.pin className={cn("text-lg")} />
                            }
                            description={
                                isPinned
                                    ? "Unpin this comment"
                                    : "Pin this comment"
                            }
                            onPress={handleCommentPin}
                        >
                            {isPinned ? "Unpin" : "Pin"}
                        </DropdownItem>

                        <DropdownItem
                            className={cn(
                                user.id === comment.authorId
                                    ? "visible"
                                    : "hidden"
                            )}
                            startContent={
                                <Icons.pencil className={cn("text-lg")} />
                            }
                            description={"Edit this comment"}
                            onPress={onEditModalOpen}
                        >
                            Edit
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection title={"Danger Zone"}>
                        <DropdownItem
                            className={cn(
                                ["admin", "owner"].includes(
                                    user.privateMetadata.role
                                ) || user.id === comment.authorId
                                    ? "visible"
                                    : "hidden"
                            )}
                            startContent={
                                <Icons.trash className={cn("text-lg")} />
                            }
                            description={"Delete this comment"}
                            onPress={onDeleteModalOpen}
                            color="danger"
                        >
                            Delete
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>

            <Modal
                isOpen={isEditModalOpen}
                onOpenChange={onEditModalOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Edit Comment
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    Make changes to your comment & save it to
                                    update the comment on the blog
                                </p>
                                <div className="pt-3">
                                    <TextareaAutosize
                                        id="edit_comment"
                                        disabled={
                                            isPosting || user ? false : true
                                        }
                                        placeholder="Edit your comment here"
                                        value={commentText}
                                        className="min-h-[80px] w-full resize-none overflow-hidden rounded-sm border border-gray-700 bg-black px-3 py-2 text-sm outline-none transition-all ease-in-out focus:border-gray-500 md:text-base"
                                        onChange={(e) =>
                                            setCommentText(e.target.value)
                                        }
                                    />
                                </div>
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
                                    onPress={handleCommentEdit}
                                    className="font-semibold"
                                    isDisabled={!isEditing}
                                >
                                    {isPosting && (
                                        <Icons.spinner className="h-4 w-4 animate-spin" />
                                    )}
                                    Save & Edit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onOpenChange={onDeleteModalOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Delete Comment
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    Are you sure you want to delete this
                                    comment? This action is irreversible. This
                                    will delete the comment and all its replies
                                    (if available).
                                </p>
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
                                    onPress={handleCommentDelete}
                                    className="font-semibold"
                                >
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default BlogCommentOperation;
