"use client";

import { NewBlog } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { Button, ButtonProps } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "../../icons/icons";
import { useToast } from "../../ui/use-toast";

function BlogCreateButton({ className, ...props }: ButtonProps) {
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
                console.error(err);

                setIsLoading(false);
                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <Button
            onPress={handleBlogCreate}
            isDisabled={isLoading}
            isLoading={isLoading}
            className={cn("font-semibold", className)}
            radius="sm"
            startContent={!isLoading && <Icons.add className="h-4 w-4" />}
            {...props}
        >
            New Blog
        </Button>
    );
}

export default BlogCreateButton;
