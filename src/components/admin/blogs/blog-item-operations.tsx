"use client";

import { handleBlogDelete, handleBlogPrivacy } from "@/src/actions/blogs";
import { Icons } from "@/src/components/icons/icons";
import { handleClientError } from "@/src/lib/utils";
import { blogPublishSchema } from "@/src/lib/validation/blogs";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
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
    useDisclosure,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PageProps {
    blog: CachedBlog;
    user: ClerkUserWithoutEmail;
}

function BlogOperations({ blog, user }: PageProps) {
    const router = useRouter();

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
        onOpenChange: onDeleteOpenChange,
    } = useDisclosure();

    const {
        isOpen: isPublishOpen,
        onOpen: onPublishOpen,
        onClose: onPublishClose,
        onOpenChange: onPublishOpenChange,
    } = useDisclosure();

    const { mutate: deleteBlog, isLoading: isDeleting } = useMutation({
        onMutate() {
            const toastId = toast.loading("Deleting blog...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            if (blog.authorId !== user.id)
                throw new Error("You are not the author of this blog!");

            await handleBlogDelete({
                blog,
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Blog has been deleted", {
                id: ctx?.toastId,
            });
        },
        onError(err, __, ctx) {
            handleClientError(err, ctx?.toastId);
        },
        onSettled() {
            onDeleteClose();
            router.refresh();
        },
    });

    const { mutate: managePrivacy, isLoading: isPublishing } = useMutation({
        onMutate() {
            const toastId = toast.loading(
                blog.published ? "Unpublishing blog..." : "Publishing blog..."
            );
            return {
                toastId,
            };
        },
        async mutationFn() {
            if (blog.authorId !== user.id)
                throw new Error("You are not the author of this blog!");

            blogPublishSchema.parse({
                title: blog.title,
                description: blog.description,
                content: blog.content,
                thumbnail: blog.thumbnailUrl,
            });

            await handleBlogPrivacy({
                blog,
            });
        },
        onSuccess(_, __, ctx) {
            toast.success(
                blog.published
                    ? "Blog has been unpublished"
                    : "Blog has been published",
                {
                    id: ctx?.toastId,
                }
            );
        },
        onError(err, __, ctx) {
            handleClientError(err, ctx?.toastId);
        },
        onSettled() {
            onPublishClose();
            router.refresh();
        },
    });

    return (
        <>
            <Dropdown>
                <DropdownTrigger>
                    <Button isIconOnly variant="light" radius="full" size="sm">
                        <Icons.moreVert className="h-4 w-4" />
                    </Button>
                </DropdownTrigger>

                <DropdownMenu>
                    <DropdownSection showDivider title={"Action"}>
                        <DropdownItem
                            startContent={<Icons.pencil className="text-lg" />}
                            description="Edit this blog"
                            onPress={() =>
                                router.push(`/admin/blogs/${blog.id}`)
                            }
                        >
                            Edit
                        </DropdownItem>

                        <DropdownItem
                            startContent={<Icons.upload className="text-lg" />}
                            description={
                                blog.published
                                    ? "Unpublish this blog"
                                    : "Publish this blog"
                            }
                            onPress={onPublishOpen}
                        >
                            {blog.published ? "Unpublish" : "Publish"}
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection title={"Danger Zone"}>
                        <DropdownItem
                            startContent={<Icons.trash className="text-lg" />}
                            description="Delete this blog"
                            color="danger"
                            onPress={onDeleteOpen}
                        >
                            Delete
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>

            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Delete Blog</ModalHeader>
                            <ModalBody>
                                Are you sure you want to delete this blog? This
                                action cannot be undone.
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    radius="sm"
                                    color="danger"
                                    variant="light"
                                    isDisabled={isDeleting}
                                    onPress={onClose}
                                    className="font-semibold"
                                >
                                    Close
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    onPress={() => deleteBlog()}
                                    className="font-semibold"
                                    isDisabled={isDeleting}
                                    isLoading={isDeleting}
                                >
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isPublishOpen} onOpenChange={onPublishOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                {blog.published
                                    ? "Unpublish Blog"
                                    : "Publish Blog"}
                            </ModalHeader>
                            <ModalBody>
                                {blog.published
                                    ? "Are you sure you want to unpublish this blog? People will not be able to see this blog anymore."
                                    : "Are you sure you want to publish this blog? You still will be able to update this blog anytime you want."}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    radius="sm"
                                    color="danger"
                                    variant="light"
                                    isDisabled={isPublishing}
                                    onPress={onClose}
                                    className="font-semibold"
                                >
                                    Close
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    onPress={() => managePrivacy()}
                                    className="font-semibold"
                                    isDisabled={isPublishing}
                                    isLoading={isPublishing}
                                >
                                    {blog.published ? "Unpublish" : "Publish"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default BlogOperations;
