"use client";

import { env } from "@/env.mjs";
import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { NewComment } from "@/src/lib/drizzle/schema";
import {
    addNotification,
    cn,
    shortenNumber,
    updateBlogViews,
} from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import {
    Avatar,
    Button,
    ButtonGroup,
    Divider,
    Textarea,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";
import BlogViewComments from "./blog-view-comments";

interface PageProps extends DefaultProps {
    params: { blogId: string };
    blog: ExtendedBlog;
    user: ClerkUser | null;
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
        if (!user) return toast.error("You're not logged in!");

        setIsLiked(!isLiked);

        if (isLiked) {
            axios
                .delete<ResponseData>(`/api/blogs/likes/${blog.id}`)
                .then(({ data: resData }) => {
                    if (resData.code !== 200)
                        return toast.error(resData.message);
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Something went wrong, try again later!");
                })
                .finally(() => router.refresh());
        } else {
            axios
                .post<ResponseData>(`/api/blogs/likes/${blog.id}`)
                .then(({ data: resData }) => {
                    if (resData.code !== 200)
                        return toast.error(resData.message);
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Something went wrong, try again later!");
                })
                .finally(() => router.refresh());

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

    const addComment = () => {
        if (!user) return toast.error("You're not logged in!");

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
                if (resData.code !== 200) return toast.error(resData.message);

                setComment("");
                toast.success("Comment published");

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
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!");
            })
            .finally(() => {
                setIsPosting(false);
                router.refresh();
            });
    };

    return (
        <>
            <ButtonGroup
                className="sticky bottom-10 z-50 backdrop-blur-sm"
                variant="flat"
            >
                <Button onPress={handleLike}>
                    <Icons.heart
                        className={cn(
                            "h-4 w-4 transition-all ease-in-out",
                            isLiked
                                ? "fill-red-500 text-red-500"
                                : "fill-transparent"
                        )}
                    />
                    {shortenNumber(blog.likes.length)}
                </Button>

                <Divider orientation="vertical" />

                <Button
                    onPress={() =>
                        router.push(`/blogs/${params.blogId}#comment`)
                    }
                >
                    <Icons.comment className="h-4 w-4" />
                    {shortenNumber(blog.comments.length)}
                </Button>

                <Divider orientation="vertical" />

                <Button>
                    <Icons.analytics className="h-4 w-4" />
                    {shortenNumber(blog.views.length)}
                </Button>

                <Divider orientation="vertical" />

                <Button
                    onPress={() => {
                        navigator.clipboard.writeText(
                            env.NEXT_PUBLIC_APP_URL + "/blogs/" + params.blogId
                        );
                        toast.success("Copied to clipboard");
                    }}
                >
                    <Icons.share className="h-4 w-4" />
                    Share
                </Button>
            </ButtonGroup>

            <div className="w-full space-y-6 pt-5">
                <p className="text-2xl font-semibold md:text-3xl">Comments</p>
                <div className="flex gap-4">
                    <div>
                        <Avatar
                            isBordered
                            showFallback
                            as="span"
                            alt={user?.username || "User"}
                            size="md"
                            src={user?.imageUrl || DEFAULT_USER_IMAGE.src}
                        />
                    </div>

                    <div className="w-full space-y-2">
                        <p className="cursor-default text-sm md:text-base">
                            {user ? <>@{user.username}</> : <>@user</>}
                        </p>

                        <Textarea
                            id="comment"
                            radius="sm"
                            variant="underlined"
                            minRows={1}
                            value={comment}
                            isDisabled={isPosting || !user}
                            placeholder={
                                user
                                    ? "Add a comment"
                                    : "You need to login in order to comment"
                            }
                            onValueChange={setComment}
                        />

                        <div className="flex items-center justify-end gap-2">
                            <Button
                                radius="sm"
                                variant="light"
                                color="danger"
                                isDisabled={!isActive}
                                onPress={() => setComment("")}
                                className="font-semibold"
                            >
                                Cancel
                            </Button>
                            <Button
                                isDisabled={!isActive}
                                onPress={addComment}
                                variant="flat"
                                color="primary"
                                radius="sm"
                                className="font-semibold"
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