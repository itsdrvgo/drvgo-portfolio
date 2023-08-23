"use client";

import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "../../icons/icons";
import { ButtonProps, buttonVariants } from "../../ui/button";
import { useToast } from "../../ui/use-toast";

interface PostCreateButtonProps extends ButtonProps {}

export function BlogCreateButton({
    className,
    variant,
    ...props
}: PostCreateButtonProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleBlogCreate = async () => {
        setIsLoading(true);

        const data = {
            title: "Untitled Blog",
        };

        axios
            .post<ResponseData>("/api/blogs", JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(({ data: resData }) => {
                setIsLoading(false);
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                const blogId = JSON.parse(resData.data);

                router.refresh();
                router.push(`/admin/blogs/${blogId}`);
            });
    };

    return (
        <button
            onClick={handleBlogCreate}
            className={cn(
                buttonVariants({ variant }),
                { "cursor-not-allowed opacity-60": isLoading },
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Icons.add className="mr-2 h-4 w-4" />
            )}
            New Blog
        </button>
    );
}
