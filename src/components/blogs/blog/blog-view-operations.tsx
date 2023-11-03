"use client";

import { env } from "@/env.mjs";
import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { NewComment } from "@/src/lib/drizzle/schema";
import { cn, shortenNumber, updateBlogViews } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { ExtendedComment } from "@/src/types";
import { CachedBlog, CachedRole, CachedUser } from "@/src/types/cache";
import {
    Avatar,
    Button,
    ButtonGroup,
    Divider,
    Textarea,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";
import BlogViewComments from "./blog-view-comments";

interface PageProps {
    blog: CachedBlog;
    user: ClerkUserWithoutEmail | null;
    blogIsLiked: boolean | false;
    roles: CachedRole[];
    comments: ExtendedComment[];
    author: CachedUser;
}

function BlogViewOperations({
    blog,
    user,
    blogIsLiked,
    roles,
    comments,
    author,
}: PageProps) {
    const router = useRouter();

    const [comment, setComment] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [isLiked, setIsLiked] = useState(blogIsLiked);
    const [likesLength, setLikesLength] = useState(blog.likes);

    useEffect(() => {
        updateBlogViews(blog.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (comment.length) setIsActive(true);
        else setIsActive(false);
    }, [comment.length]);

    const { mutate: handleLike } = useMutation({
        mutationFn: async () => {
            const response = !isLiked
                ? await axios.delete<ResponseData>(
                      `/api/blogs/likes/${blog.id}`
                  )
                : await axios.post<ResponseData>(`/api/blogs/likes/${blog.id}`);

            return response.data;
        },
        onMutate: async () => {
            const previousLikes = likesLength;

            setLikesLength((previousLikes || 0) + (isLiked ? -1 : 1));
            setIsLiked(!isLiked);

            return { previousLikes };
        },
        onError: (err, _, context) => {
            console.error(err);
            setLikesLength(context!.previousLikes);
            setIsLiked(!isLiked);

            return toast.error("Something went wrong, try again later!");
        },
        onSuccess: (res) => {
            if (res.code !== 200) return toast.error(res.message);
        },
    });

    const addComment = () => {
        if (!user) return toast.error("You're not logged in!");

        setIsActive(false);
        setIsPosting(true);

        const toastId = toast.loading("Posting comment...");

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
                if (resData.code !== 200)
                    return toast.error(resData.message, {
                        id: toastId,
                    });

                setComment("");
                toast.success("Comment published", {
                    id: toastId,
                });
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!", {
                    id: toastId,
                });
            })
            .finally(() => {
                setIsPosting(false);
                router.refresh();
            });
    };

    return (
        <>
            <ButtonGroup
                className="sticky bottom-10 z-50"
                variant="flat"
                id="user_opt"
            >
                <Button
                    onPress={() => handleLike()}
                    className="bg-default-100 first:rounded-l-full"
                    startContent={
                        <Icons.heart
                            className={cn(
                                "h-4 w-4 transition-all ease-in-out",
                                isLiked
                                    ? "fill-red-500 text-red-500"
                                    : "fill-transparent"
                            )}
                        />
                    }
                    isDisabled={!user}
                >
                    {shortenNumber(likesLength)}
                </Button>

                <Divider orientation="vertical" />

                <Button
                    className="bg-default-100"
                    onPress={() => router.push(`/blogs/${blog.id}#comment`)}
                    startContent={<Icons.comment className="h-4 w-4" />}
                    isDisabled={!user}
                >
                    {shortenNumber(blog.comments)}
                </Button>

                <Divider orientation="vertical" />

                <Button
                    className="bg-default-100"
                    startContent={<Icons.analytics className="h-4 w-4" />}
                >
                    {shortenNumber(blog.views)}
                </Button>

                <Divider orientation="vertical" />

                <Button
                    className="bg-default-100 last:rounded-r-full"
                    onPress={() => {
                        navigator.clipboard.writeText(
                            env.NEXT_PUBLIC_APP_URL + "/blogs/" + blog.id
                        );
                        toast.success("Copied to clipboard");
                    }}
                    startContent={<Icons.share className="h-4 w-4" />}
                >
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
                            variant="underlined"
                            aria-label="Comment"
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
                    roles={roles}
                    comments={comments}
                    author={author}
                />
            </div>
        </>
    );
}

export default BlogViewOperations;
