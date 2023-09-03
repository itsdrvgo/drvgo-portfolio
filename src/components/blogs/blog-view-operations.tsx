"use client";

import { env } from "@/env.mjs";
import { defaultUserPFP } from "@/src/config/const";
import { NewComment, User } from "@/src/lib/drizzle/schema";
import {
    addNotification,
    cn,
    shortenNumber,
    updateBlogViews,
} from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Icons } from "../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";
import BlogViewComments from "./blog-view-comments";

interface PageProps extends DefaultProps {
    params: { blogId: string };
    blog: ExtendedBlog;
    user: User | null;
    blogIsLiked: boolean | false;
}

function BlogViewOperations({
    className,
    params,
    blog,
    user,
    blogIsLiked,
}: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [comment, setComment] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [isLiked, setIsLiked] = useState(blogIsLiked);

    useEffect(() => {
        updateBlogViews(blog.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (comment.length) setIsActive(true);
        else setIsActive(false);
    }, [comment.length]);

    const handleLike = () => {
        if (!user)
            return toast({
                title: "Oops!",
                description: "You're not logged in",
                variant: "destructive",
                action: (
                    <ToastAction
                        className="border-white focus:ring-0 focus:ring-offset-0"
                        altText="Login to continue"
                        onClick={() => router.push("/signin")}
                    >
                        Login
                    </ToastAction>
                ),
            });
        setIsLiked(!isLiked);

        if (isLiked) {
            axios
                .delete<ResponseData>(`/api/blogs/likes/${blog.id}`)
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
                        description: "Something went wrong, try again later",
                        variant: "destructive",
                    });
                });
        } else {
            axios
                .post<ResponseData>(`/api/blogs/likes/${blog.id}`)
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
                        description: "Something went wrong, try again later",
                        variant: "destructive",
                    });
                });

            addNotification({
                userId: blog.authorId,
                content: `@${user.username} liked your blog`,
                title: "New like",
                notifierId: user.id,
                props: {
                    type: "blogLike",
                    blogId: blog.id,
                    blogThumbnailUrl: blog.thumbnailUrl!,
                    blogTitle: blog.title,
                },
            });
        }
    };

    const addComment = async () => {
        if (!user)
            return toast({
                title: "Oops!",
                description: "You're not logged in",
                variant: "destructive",
                action: (
                    <ToastAction
                        className="border-white focus:ring-0 focus:ring-offset-0"
                        altText="Login to continue"
                        onClick={() => router.push("/signin")}
                    >
                        Login
                    </ToastAction>
                ),
            });

        setIsActive(false);
        setIsPosting(true);

        const body: Omit<NewComment, "id"> = {
            authorId: user.id,
            blogId: blog.id,
            content: comment,
        };

        axios
            .post<ResponseData>(
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

                const commentId = JSON.parse(resData.data) as string;

                addNotification({
                    userId: blog.authorId,
                    content: `@${user.username} commented on your blog`,
                    title: "New comment",
                    notifierId: user.id,
                    props: {
                        type: "blogComment",
                        blogId: blog.id,
                        blogThumbnailUrl: blog.thumbnailUrl!,
                        commentContent: comment,
                        commentId,
                    },
                });

                router.refresh();
            })
            .catch((err) => {
                setIsPosting(false);
                console.log(err);

                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <>
            <div
                className={cn(
                    "sticky bottom-10 flex items-center gap-4 rounded-full border border-border bg-white/5 p-3 px-5 backdrop-blur-sm",
                    className
                )}
            >
                <button
                    className="flex items-center justify-center gap-2"
                    onClick={handleLike}
                >
                    <Icons.heart
                        className={cn(
                            "h-4 w-4 transition-all ease-in-out",
                            isLiked
                                ? "fill-red-500 text-red-500"
                                : "fill-transparent text-gray-500"
                        )}
                    />
                    {shortenNumber(blog.likes.length)}
                </button>

                <Separator orientation="vertical" className="h-6 bg-gray-500" />

                <button
                    className="flex cursor-pointer items-center justify-center gap-2"
                    onClick={() =>
                        router.push(`/blogs/${params.blogId}#comment`)
                    }
                >
                    <Icons.comment className="h-4 w-4" />
                    {shortenNumber(blog.comments.length)}
                </button>

                <Separator orientation="vertical" className="h-6 bg-gray-500" />

                <div className="flex cursor-pointer items-center justify-center gap-2">
                    <Icons.analytics className="h-4 w-4" />
                    {shortenNumber(blog.views.length)}
                </div>

                <Separator orientation="vertical" className="h-6 bg-gray-500" />

                <button
                    className="flex cursor-pointer items-center justify-center gap-2"
                    onClick={() => {
                        navigator.clipboard.writeText(
                            env.NEXT_PUBLIC_APP_URL + "/blogs/" + params.blogId
                        );
                        toast({
                            description: "Link has been copied to clipboard",
                        });
                    }}
                >
                    <Icons.share className="h-4 w-4" />
                    Share
                </button>
            </div>

            <div className="w-full space-y-6 pt-5">
                <p className="text-2xl font-semibold md:text-3xl">Comments</p>
                <div className="flex gap-4">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                        {user ? (
                            <>
                                <AvatarImage
                                    src={user.image ?? defaultUserPFP.src}
                                    alt={user.username}
                                />
                                <AvatarFallback>
                                    {user.username[0].toUpperCase()}
                                </AvatarFallback>
                            </>
                        ) : (
                            <>
                                <AvatarImage
                                    src={defaultUserPFP.src}
                                    alt={"User"}
                                />
                                <AvatarFallback>{"D"}</AvatarFallback>
                            </>
                        )}
                    </Avatar>
                    <div className="w-full space-y-2">
                        <p className="cursor-default text-sm md:text-base">
                            {user ? <>@{user.username}</> : <>@user</>}
                        </p>
                        <TextareaAutosize
                            id="comment"
                            disabled={isPosting || user ? false : true}
                            placeholder={
                                user
                                    ? "Add a comment"
                                    : "You need to login in order to comment"
                            }
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
                    blog={blog}
                    className="space-y-6"
                    user={user}
                    params={params}
                />
            </div>
        </>
    );
}

export default BlogViewOperations;
