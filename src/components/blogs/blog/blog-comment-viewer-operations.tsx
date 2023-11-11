"use client";

import {
    loveComment,
    replyToComment,
    unloveComment,
} from "@/src/actions/comments";
import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { cn, handleClientError } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedComment } from "@/src/types";
import { CachedBlog } from "@/src/types/cache";
import { Avatar, Button, Textarea } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

interface PageProps extends DefaultProps {
    user: ClerkUserWithoutEmail | null;
    blog: CachedBlog;
    comment: ExtendedComment;
    commentLoved: boolean;
}

function BlogCommentViewerOperation({
    user,
    blog,
    comment,
    commentLoved,
}: PageProps) {
    const router = useRouter();

    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isLoved, setIsLoved] = useState(commentLoved);
    const [lovesLength, setLovesLength] = useState(comment.loves.length);

    useEffect(() => {
        if (reply.length) setIsActive(true);
        else setIsActive(false);
    }, [reply.length]);

    const handleSetReply = () => {
        if (!user) return toast.error("You're not logged in!");
        setIsReplying(true);
    };

    const { mutate: handleReplyAdd, isLoading: isPosting } = useMutation({
        onMutate() {
            setIsActive(false);

            const toastId = toast.loading("Adding reply...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            if (!user) return toast.error("You're not logged in!");

            await replyToComment({
                blog,
                comment,
                user,
                content: reply,
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Reply added", {
                id: ctx?.toastId!,
            });
            setReply("");
            setIsReplying(false);
            router.refresh();
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
        },
    });

    const { mutate: handleCommentLove } = useMutation({
        onMutate() {
            const previousLoves = lovesLength;

            setLovesLength((previousLoves || 0) + (isLoved ? -1 : 1));
            setIsLoved(!isLoved);

            return { previousLoves };
        },
        async mutationFn() {
            if (!user) return toast.error("You're not logged in!");

            isLoved
                ? await loveComment({
                      comment,
                      user,
                  })
                : await unloveComment({
                      comment,
                      user,
                  });
        },
        onError(err, _, ctx) {
            setLovesLength(ctx?.previousLoves!);
            setIsLoved(!isLoved);
            handleClientError(err);
        },
    });

    return (
        <>
            <div className="flex items-center gap-2 text-gray-400">
                <button
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => handleCommentLove()}
                >
                    <Icons.heart
                        className={cn(
                            "h-4 w-4 transition-all ease-in-out",
                            isLoved ? "fill-red-600 text-red-600" : "fill-none"
                        )}
                    />
                    <p className="text-sm">{comment.loves.length}</p>
                </button>
                <Button
                    size="sm"
                    radius="full"
                    className="bg-transparent text-sm transition-all ease-in-out hover:bg-gray-800"
                    onPress={handleSetReply}
                >
                    Reply
                </Button>
            </div>

            {isReplying && user ? (
                <div className="flex flex-col items-center gap-4 pt-5">
                    <div className="flex w-full gap-4">
                        <div>
                            <Avatar
                                isBordered
                                showFallback
                                as="span"
                                alt={user.username!}
                                size="sm"
                                src={user.imageUrl || DEFAULT_USER_IMAGE.src}
                            />
                        </div>

                        <Textarea
                            variant="underlined"
                            aria-label="Reply"
                            minRows={1}
                            value={reply}
                            isDisabled={isPosting || !user}
                            placeholder="Reply to this comment"
                            onValueChange={setReply}
                        />
                    </div>

                    <div className="flex w-full items-center justify-end gap-2">
                        <Button
                            size="sm"
                            radius="sm"
                            variant="light"
                            color="danger"
                            onPress={() => {
                                setIsReplying(false);
                                setReply("");
                            }}
                            isDisabled={isPosting}
                            className="font-semibold"
                        >
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={() => handleReplyAdd()}
                            isDisabled={!isActive}
                            className="font-semibold"
                            radius="sm"
                        >
                            Reply
                        </Button>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default BlogCommentViewerOperation;
