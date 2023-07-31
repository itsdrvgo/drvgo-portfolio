"use client";

import { env } from "@/env.mjs";
import { defaultUserPFP } from "@/src/config/const";
import {
    Blog,
    Comment,
    Like,
    NewComment,
    User,
} from "@/src/lib/drizzle/schema";
import { LikeUpdateData } from "@/src/lib/validation/blogs";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Icons } from "../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useToast } from "../ui/use-toast";
import BlogViewComments from "./blog-view-comments";

interface PageProps extends DefaultProps {
    params: { blogId: string };
    blog: Blog;
    comments: Comment[];
    likes: Like[];
    user: User;
    users: User[];
    like: Like | undefined;
}

function BlogViewOperations({
    className,
    params,
    blog,
    comments,
    likes,
    user,
    users,
    like,
}: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [comment, setComment] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [isLiked, setIsLiked] = useState(like ? true : false);

    useEffect(() => {
        if (comment.length) setIsActive(true);
        else setIsActive(false);
    }, [comment.length]);

    const handleLike = () => {
        setIsLiked(!isLiked);

        const body: LikeUpdateData = {
            userId: user.id,
            isLiked,
        };

        axios
            .patch<ResponseData>(
                `/api/blogs/likes/${blog.id}`,
                JSON.stringify(body)
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                router.refresh();
            })
            .catch((err) => {
                console.log(err);

                toast({
                    title: "Oops!",
                    description: "Internal Server Error, try again later",
                    variant: "destructive",
                });
            });
    };

    const addComment = async () => {
        setIsActive(false);
        setIsPosting(true);

        const body: NewComment = {
            authorId: user.id,
            blogId: blog.id,
            content: comment,
        };

        axios
            .patch<ResponseData>(
                `/api/blogs/comments/${blog.id}`,
                JSON.stringify(body)
            )
            .then(({ data: resData }) => {
                setIsPosting(false);

                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                setComment("");
                toast({
                    description: "Comment published",
                });

                router.refresh();
            })
            .catch((err) => {
                setIsPosting(false);
                console.log(err);

                toast({
                    title: "Oops!",
                    description: "Internal Server Error, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <>
            <div className={className}>
                <div className="grid w-full cursor-default grid-cols-3 justify-items-stretch gap-3 p-2 text-sm text-gray-400">
                    <button
                        className="flex items-center justify-center gap-2"
                        onClick={handleLike}
                    >
                        {isLiked ? (
                            <>
                                <Icons.heart className="h-4 w-4 fill-gray-400" />
                                Liked
                            </>
                        ) : (
                            <>
                                <Icons.heart className="h-4 w-4" />
                                Like
                            </>
                        )}
                    </button>
                    <button
                        className="flex cursor-pointer items-center justify-center gap-2"
                        onClick={() =>
                            router.push(`/blogs/${params.blogId}#comment`)
                        }
                    >
                        <Icons.comment className="h-4 w-4" />
                        Comment
                    </button>
                    <button
                        className="flex cursor-pointer items-center justify-center gap-2"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                env.NEXT_PUBLIC_APP_URL +
                                    "/blogs/" +
                                    params.blogId
                            );
                            toast({
                                description:
                                    "Link has been copied to clipboard",
                            });
                        }}
                    >
                        <Icons.share className="h-4 w-4" />
                        Share
                    </button>
                </div>
                <Separator />
                <div className="w-full space-y-6 pt-5">
                    <p className="text-2xl font-semibold md:text-3xl">
                        Comments
                    </p>
                    <div className="flex gap-4">
                        <Avatar className="h-8 w-8 md:h-10 md:w-10">
                            <AvatarImage
                                src={user.image ?? defaultUserPFP.src}
                                alt={user.name ?? user.id}
                            />
                            <AvatarFallback>
                                {(user.name ?? user.id).charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="w-full space-y-2">
                            <p className="cursor-default text-sm md:text-base">
                                @{user.name ?? user.id}
                            </p>
                            <TextareaAutosize
                                id="comment"
                                disabled={isPosting}
                                placeholder="Add a comment"
                                value={comment}
                                className="min-h-[100px] w-full resize-none overflow-hidden rounded-sm border border-gray-700 bg-zinc-950 px-3 py-2 text-sm focus:border-white md:text-base"
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    variant={"secondary"}
                                    size={"sm"}
                                    disabled={!isActive}
                                    onClick={() => setComment("")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size={"sm"}
                                    disabled={!isActive}
                                    onClick={addComment}
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>

                    <BlogViewComments
                        comments={comments}
                        users={users}
                        className="space-y-6"
                    />
                </div>
            </div>
        </>
    );
}

export default BlogViewOperations;