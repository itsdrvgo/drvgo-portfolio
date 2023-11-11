"use client";

import {
    deleteComment,
    pinComment,
    unpinComment,
    updateComment,
} from "@/src/actions/comments";
import { BitFieldPermissions } from "@/src/config/const";
import { cn, handleClientError, hasPermission } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedComment } from "@/src/types";
import { CachedBlog } from "@/src/types/cache";
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
    Textarea,
    useDisclosure,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

interface PageProps extends DefaultProps {
    user: ClerkUserWithoutEmail;
    blog: CachedBlog;
    comment: ExtendedComment;
}

function BlogCommentOperation({ user, blog, comment }: PageProps) {
    const router = useRouter();

    const [isPinned, setIsPinned] = useState(comment.pinned);
    const [isEditing, setIsEditing] = useState(false);
    const [commentText, setCommentText] = useState(comment.content);

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

    const { mutate: handleCommentDelete, isLoading: isDeleting } = useMutation({
        onMutate() {
            const toastId = toast.loading("Deleting comment...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            const isAuthor = user.id === comment.authorId;
            const isAdmin = hasPermission(
                user.privateMetadata.permissions,
                BitFieldPermissions.ManageBlogs |
                    BitFieldPermissions.ManagePages
            );

            if (!isAuthor && !isAdmin)
                throw new Error("You are not allowed to delete this comment");

            await deleteComment({
                blog,
                comment,
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Comment deleted", {
                id: ctx?.toastId,
            });
            router.refresh();
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
        },
        onSettled() {
            onDeleteModalClose();
        },
    });

    const { mutate: handleCommentPin } = useMutation({
        onMutate() {
            const toastId = toast.loading(
                `${isPinned ? "Unpinning" : "Pinning"} comment...`
            );
            setIsPinned(!isPinned);
            return {
                toastId,
            };
        },
        async mutationFn() {
            const isAuthorized = hasPermission(
                user.privateMetadata.permissions,
                BitFieldPermissions.ManageBlogs |
                    BitFieldPermissions.ManagePages
            );
            if (!isAuthorized) throw new Error("You are not authorized!");

            isPinned
                ? await pinComment({
                      comment,
                      user,
                  })
                : await unpinComment({
                      comment,
                  });
        },
        onSuccess(_, __, ctx) {
            toast.success(`Comment ${isPinned ? "pinned" : "unpinned"}`, {
                id: ctx?.toastId,
            });
            router.refresh();
        },
        onError(err, _, ctx) {
            setIsPinned(!isPinned);
            handleClientError(err, ctx?.toastId);
        },
    });

    const { mutate: handleCommentEdit, isLoading: isPosting } = useMutation({
        onMutate() {
            const toastId = toast.loading("Updating comment...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            const isAuthor = user.id === comment.authorId;
            if (!isAuthor)
                throw new Error("You are not allowed to edit this comment");

            await updateComment({
                comment,
                content: commentText,
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Comment updated", {
                id: ctx?.toastId,
            });
            router.refresh();
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
        },
        onSettled() {
            onEditModalClose();
        },
    });

    return (
        <>
            <Dropdown
                classNames={{
                    base:
                        hasPermission(
                            user.privateMetadata.permissions,
                            BitFieldPermissions.ManageBlogs |
                                BitFieldPermissions.ManagePages
                        ) || user.id === comment.authorId
                            ? "visible"
                            : "hidden",
                }}
            >
                <DropdownTrigger>
                    <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        size="sm"
                        startContent={<Icons.moreVert className="h-4 w-4" />}
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label="Dropdown menu for comment operations">
                    <DropdownSection
                        title={"Action"}
                        showDivider={
                            hasPermission(
                                user.privateMetadata.permissions,
                                BitFieldPermissions.ManageBlogs |
                                    BitFieldPermissions.ManagePages
                            ) || user.id === comment.authorId
                        }
                    >
                        <DropdownItem
                            className={cn(
                                comment.parentId === null &&
                                    hasPermission(
                                        user.privateMetadata.permissions,
                                        BitFieldPermissions.ManageBlogs |
                                            BitFieldPermissions.ManagePages
                                    )
                                    ? "visible"
                                    : "hidden"
                            )}
                            startContent={<Icons.pin className="text-lg" />}
                            description={
                                isPinned
                                    ? "Unpin this comment"
                                    : "Pin this comment"
                            }
                            onPress={() => handleCommentPin()}
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

                    <DropdownSection
                        title={"Danger Zone"}
                        className={cn(
                            hasPermission(
                                user.privateMetadata.permissions,
                                BitFieldPermissions.ManageBlogs |
                                    BitFieldPermissions.ManagePages
                            ) || user.id === comment.authorId
                                ? "visible"
                                : "hidden"
                        )}
                    >
                        <DropdownItem
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
                isDismissable={!isPosting}
                hideCloseButton={isPosting}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Edit Comment</ModalHeader>
                            <ModalBody>
                                <p>
                                    Make changes to your comment & save it to
                                    update the comment on the blog
                                </p>

                                <div className="pt-3">
                                    <Textarea
                                        id="edit_comment"
                                        aria-label="Edit Comment"
                                        variant="underlined"
                                        minRows={1}
                                        value={commentText}
                                        isDisabled={isPosting || !user}
                                        placeholder="Edit your comment here"
                                        onValueChange={setCommentText}
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
                                    isDisabled={isPosting}
                                >
                                    Close
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    variant="flat"
                                    onPress={() => handleCommentEdit()}
                                    className="font-semibold"
                                    isLoading={isPosting}
                                    isDisabled={!isEditing || isPosting}
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
                isDismissable={!isDeleting}
                hideCloseButton={isDeleting}
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
                                    isDisabled={isDeleting}
                                    className="font-semibold"
                                >
                                    Close
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    variant="flat"
                                    isDisabled={isDeleting}
                                    isLoading={isDeleting}
                                    onPress={() => handleCommentDelete()}
                                    className="font-semibold"
                                >
                                    Delete
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
