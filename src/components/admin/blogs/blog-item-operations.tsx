"use client";

import { Icons } from "@/src/components/icons/icons";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useToast } from "@/src/components/ui/use-toast";
import { addNotification } from "@/src/lib/utils";
import { BlogPatchData } from "@/src/lib/validation/blogs";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PageProps extends DefaultProps {
    blog: ExtendedBlog;
}

function BlogOperations({ blog, className }: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [showPublishAlert, setShowPublishAlert] = useState<boolean>(false);
    const [isPublishLoading, setIsPublishLoading] = useState<boolean>(false);

    const deleteBlog = async () => {
        setIsDeleteLoading(true);
        toast({
            description: "Deleting blog...",
        });

        axios
            .delete<ResponseData>(`/api/blogs/${blog.id}`)
            .then(({ data: resData }) => {
                setIsDeleteLoading(false);
                setShowDeleteAlert(false);

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
                setIsDeleteLoading(false);
                setShowDeleteAlert(false);
                console.log(err);

                toast({
                    title: "Oops!",
                    description: "Blog was not deleted, try again later",
                    variant: "destructive",
                });
            });
    };

    const publishBlog = () => {
        setIsPublishLoading(true);
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
                setIsPublishLoading(false);
                setShowPublishAlert(false);

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
                setIsPublishLoading(false);
                setShowPublishAlert(false);
                console.log(err);

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
            <DropdownMenu>
                <DropdownMenuTrigger className={className}>
                    <Icons.ellipsis className="h-4 w-4" />
                    <span className="sr-only">Open</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Link
                            href={`/admin/blogs/${blog.id}`}
                            className="flex w-full"
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center"
                        onSelect={() => setShowPublishAlert(true)}
                    >
                        {blog.published ? "Unpublish" : "Publish"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                        onSelect={() => setShowDeleteAlert(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog
                open={showDeleteAlert}
                onOpenChange={setShowDeleteAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this blog?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteBlog}>
                            {isDeleteLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.trash className="mr-2 h-4 w-4" />
                            )}
                            <span>Delete</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog
                open={showPublishAlert}
                onOpenChange={setShowPublishAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {blog.published
                                ? "Are you sure you want to unpublish this blog?"
                                : "Are you sure you want to publish this blog?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {blog.published
                                ? "People will not be able to see this blog anymore."
                                : "You still will be able to update this blog anytime you want."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={publishBlog}>
                            {isPublishLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.pencil className="mr-2 h-4 w-4" />
                            )}
                            <span>
                                {" "}
                                {blog.published
                                    ? "Unpublish it!"
                                    : "Publish it!"}
                            </span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default BlogOperations;
