"use client";

import { BitFieldPermissions } from "@/src/config/const";
import { NewComment } from "@/src/lib/drizzle/schema";
import { cn, hasPermission } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUser } from "@/src/lib/validation/user";
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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

interface PageProps extends DefaultProps {
    user: ClerkUser;
    blog: CachedBlog;
    comment: ExtendedComment;
}

function BlogCommentOperation({ user, blog, comment }: PageProps) {
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
                `/api/blogs/comments/${blog.id}/${comment.id}`
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200) return toast.error(resData.message);

                toast.success("Comment deleted");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!");
            })
            .finally(() => {
                onDeleteModalClose();
                router.refresh();
            });
    };

    const handleCommentPin = () => {
        axios
            .post<ResponseData>(
                `/api/blogs/comments/${blog.id}/${comment.id}/${
                    isPinned ? "unpin" : "pin"
                }`
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200) return toast.error(resData.message);

                setIsPinned(!isPinned);
                toast.success(`Comment ${isPinned ? "unpinned" : "pinned"}`);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!");
            })
            .finally(() => {
                router.refresh();
            });
    };

    const handleCommentEdit = () => {
        setIsPosting(true);
        setIsEditing(false);

        const body: Pick<NewComment, "content"> = {
            content: commentText,
        };

        axios
            .patch<ResponseData>(
                `/api/blogs/comments/${blog.id}/${comment.id}`,
                JSON.stringify(body)
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200) return toast.error(resData.message);
                toast.success("Comment updated");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!");
            })
            .finally(() => {
                setIsPosting(false);
                onEditModalClose();
                router.refresh();
            });
    };

    return (
        <>
            <Dropdown
                radius="sm"
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
                    <Button isIconOnly variant="flat" radius="sm" size="sm">
                        <Icons.moreVert className="h-4 w-4" />
                    </Button>
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
                                        radius="sm"
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
                                >
                                    Close
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    variant="flat"
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
                                    variant="flat"
                                    onPress={handleCommentDelete}
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
