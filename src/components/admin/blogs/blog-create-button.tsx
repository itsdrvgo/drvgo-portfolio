"use client";

import { NewBlog } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "../../icons/icons";
import { ButtonProps, buttonVariants } from "../../ui/button";
import { useToast } from "../../ui/use-toast";

function BlogCreateButton({ className, variant, ...props }: ButtonProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleBlogCreate = async () => {
        setIsLoading(true);

        const data: Pick<NewBlog, "title"> = {
            title: "Untitled Blog",
        };

        axios
            .post<ResponseData>("/api/blogs", JSON.stringify(data))
            .then(({ data: resData }) => {
                setIsLoading(false);
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                const blogId = JSON.parse(resData.data);
                router.push(`/admin/blogs/${blogId}`);
            })
            .catch((err) => {
                console.log(err);

                setIsLoading(false);
                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
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

export default BlogCreateButton;
