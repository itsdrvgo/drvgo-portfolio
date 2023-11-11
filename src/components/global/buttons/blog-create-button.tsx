"use client";

import { handleBlogCreate } from "@/src/actions/blogs";
import { cn, handleClientError } from "@/src/lib/utils";
import { Button, ButtonProps } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

function BlogCreateButton({ className, ...props }: ButtonProps) {
    const router = useRouter();

    const { mutate: createBlog, isLoading } = useMutation({
        onMutate() {
            const toastId = toast.loading("Creating blog...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            const { id } = await handleBlogCreate();
            return { id };
        },
        onSuccess({ id }, __, ctx) {
            toast.success("Blog created successfully", {
                id: ctx?.toastId,
            });
            router.push(`/admin/blogs/${id}`);
        },
        onError(err, __, ctx) {
            handleClientError(err, ctx?.toastId);
        },
    });

    return (
        <Button
            onPress={() => createBlog()}
            isDisabled={isLoading}
            isLoading={isLoading}
            className={cn("font-semibold", className)}
            startContent={!isLoading && <Icons.add className="h-4 w-4" />}
            {...props}
        >
            New Blog
        </Button>
    );
}

export default BlogCreateButton;
