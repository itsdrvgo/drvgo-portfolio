"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { NewComment } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedComment } from "@/src/types";
import { CachedBlog } from "@/src/types/cache";
import { Avatar, Button, Textarea } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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
    const [isPosting, setIsPosting] = useState(false);
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

    const handleReplyAdd = () => {
        setIsActive(false);
        setIsPosting(true);

        const body: Pick<NewComment, "content"> = {
            content: reply,
        };

        axios
            .post<ResponseData>(
                `/api/blogs/comments/${blog.id}/${
                    comment.parentId === null ? comment.id : comment.parentId
                }`,
                JSON.stringify(body)
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200) return toast.error(resData.message);
                toast.success("Reply added");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!");
            })
            .finally(() => {
                setIsPosting(false);
                setIsReplying(false);
                setReply("");
                router.refresh();
            });
    };

    const { mutate: handleCommentLove } = useMutation({
        mutationFn: async () => {
            const response = await axios.post<ResponseData>(
                `/api/blogs/comments/${blog.id}/${comment.id}/${
                    !isLoved ? "unlove" : "love"
                }`
            );

            return response.data;
        },
        onMutate: async () => {
            const previousLoves = lovesLength;

            setLovesLength((previousLoves || 0) + (isLoved ? -1 : 1));
            setIsLoved(!isLoved);

            return { previousLoves };
        },
        onError: (err, _, context) => {
            console.error(err);
            setLovesLength(context!.previousLoves);
            setIsLoved(!isLoved);

            return toast.error("Something went wrong, try again later!");
        },
        onSuccess: (res) => {
            if (res.code !== 200) return toast.error(res.message);
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
                            onPress={handleReplyAdd}
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
