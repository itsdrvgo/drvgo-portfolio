"use client";

import { Comment, User } from "@/src/lib/drizzle/schema";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";

interface PageProps extends DefaultProps {
    user: User;
    params: {
        blogId: string;
    };
    comment: Comment;
}

function BlogCommentOperation({ user, params, comment }: PageProps) {
    const { toast } = useToast();
    const router = useRouter();

    const handleCommentDelete = () => {
        axios
            .delete<ResponseData>(
                `/api/blogs/comments/${params.blogId}/${comment.id}`
            )
            .then(({ data: resData }) => {
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
                console.log(err);
                return toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <>
            {["admin", "owner"].includes(user.role) ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-md border border-border p-1">
                        <Icons.moreVert className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={handleCommentDelete}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : user.id === comment.authorId ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-md border border-border p-1">
                        <Icons.moreVert className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={handleCommentDelete}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : null}
        </>
    );
}

export default BlogCommentOperation;
