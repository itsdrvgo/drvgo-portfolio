"use client";

import { Icons } from "@/src/components/icons/icons";
import { useToast } from "@/src/components/ui/use-toast";
import { addNotification, cn } from "@/src/lib/utils";
import { BlogPatchData } from "@/src/lib/validation/blogs";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps, ExtendedBlog } from "@/src/types";
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
import { useState } from "react";

interface PageProps extends DefaultProps {
    blog: ExtendedBlog;
}

function BlogOperations({ blog, className }: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);

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

    const deleteBlog = async () => {
        setIsDeleting(true);
        toast({
            description: "Deleting blog...",
        });

        axios
            .delete<ResponseData>(`/api/blogs/${blog.id}`)
            .then(({ data: resData }) => {
                setIsDeleting(false);
                onDeleteClose();

                if (resData.code !== 204)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: "Blog has been deleted",
                });

                router.refresh();
            })
            .catch((err) => {
                console.error(err);

                setIsDeleting(false);
                onDeleteClose();

                toast({
                    title: "Oops!",
                    description: "Blog was not deleted, try again later",
                    variant: "destructive",
                });
            });
    };

    const publishBlog = () => {
        setIsPublishing(true);
        toast({
            description: blog.published
                ? "Unpublishing blog..."
                : "Publishing blog...",
        });

        const body: BlogPatchData = {
            ...blog,
            published: !blog.published,
            action: "publish",
        };

        axios
            .patch<ResponseData>(`/api/blogs/${blog.id}`, JSON.stringify(body))
            .then(({ data: resData }) => {
                setIsPublishing(false);
                onPublishClose();

                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: blog.published
                        ? "Blog has been unpublished"
                        : "Blog has been published",
                });

                addNotification({
                    notifierId: blog.authorId,
                    title: "New Blog",
                    content: `@${blog.author.username} published a new blog`,
                    props: {
                        type: "newBlog",
                        blogId: blog.id,
                        blogThumbnailUrl: blog.thumbnailUrl!,
                        blogTitle: blog.title,
                    },
                });

                router.refresh();
            })
            .catch((err) => {
                console.error(err);

                setIsPublishing(false);
                onPublishClose();

                toast({
                    title: "Oops!",
                    description: blog.published
                        ? "Error unpublishing the blog, try again later"
                        : "Blog was not published, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <>
            <Dropdown radius="sm">
                <DropdownTrigger>
                    <Button isIconOnly variant="bordered" radius="sm" size="sm">
                        <Icons.moreVert className="h-4 w-4" />
                    </Button>
                </DropdownTrigger>

                <DropdownMenu
                    itemClasses={{
                        base: "rounded-sm",
                    }}
                >
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
                                    onPress={deleteBlog}
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
                                    onPress={publishBlog}
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
