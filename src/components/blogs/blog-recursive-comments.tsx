import { defaultUserPFP } from "@/src/config/const";
import { cn, convertMstoTimeElapsed } from "@/src/lib/utils";
import { DefaultProps, ExtendedBlog, ExtendedComment } from "@/src/types";
import { User } from "@clerk/nextjs/dist/types/server";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons } from "../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import BlogCommentOperation from "./blog-comment-operation";
import BlogCommentViewerOperation from "./blog-comment-viewer-operations";

interface PageProps extends DefaultProps {
    blog: ExtendedBlog;
    user: User | null;
    params: {
        blogId: string;
    };
    comment: ExtendedComment;
    allComments: ExtendedComment[];
    isReply: boolean;
    isPinned: boolean;
}

function RecursiveComment({
    comment,
    user,
    params,
    blog,
    allComments,
    isReply = false,
    isPinned = false,
    className,
    id,
}: PageProps) {
    const [showReply, setShowReply] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    const searchParams = useSearchParams();
    const commentId = searchParams.get("commentId");

    useEffect(() => {
        if (commentId && commentId === comment.id && !isHighlighted) {
            setIsHighlighted(true);

            setTimeout(() => {
                document
                    .getElementById(commentId)
                    ?.scrollIntoView({ behavior: "smooth" });

                setTimeout(() => {
                    setIsHighlighted(false);
                }, 3000);
            }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentId, comment.id]);

    const replies = allComments.filter((c) => c.parentId === comment.id);
    const isLoved = comment.loves.find((love) => love.userId === user?.id);

    return (
        <div
            className={cn(
                "space-y-5 transition-all ease-in-out",
                className,
                isHighlighted &&
                    "rounded-md border border-accent-foreground bg-gray-800 p-2"
            )}
            id={id}
        >
            <div className={cn("flex items-start gap-4", isReply && "ml-12")}>
                <Avatar
                    className={cn(
                        isReply
                            ? "h-6 w-6 md:h-8 md:w-8"
                            : "h-8 w-8 md:h-10 md:w-10"
                    )}
                >
                    <AvatarImage
                        src={comment.user.image ?? defaultUserPFP.src}
                        alt={comment.user.username}
                    />
                    <AvatarFallback>
                        {comment.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="w-full cursor-default space-y-2">
                    {isPinned && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Icons.pin className="h-4 w-4" />
                            <p>Pinned by @{blog.author.username}</p>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <p
                            className={cn(
                                isReply
                                    ? "text-xs md:text-sm"
                                    : "text-sm md:text-base"
                            )}
                        >
                            @{comment.user.username}
                        </p>
                        {comment.edited && (
                            <p className="text-xs text-gray-400">(edited)</p>
                        )}
                        <p className="text-xs text-gray-500">
                            {convertMstoTimeElapsed(
                                comment.createdAt.getTime()
                            )}
                        </p>
                    </div>
                    <p className="text-sm font-light">
                        {isReply && (
                            <span className="mr-1 rounded-sm bg-gray-800 p-[2px] px-1 text-sm text-gray-300">
                                @
                                {
                                    allComments.find(
                                        (c) => c.id === comment.parentId
                                    )?.user.username
                                }
                            </span>
                        )}
                        {comment.content}
                    </p>
                    <BlogCommentViewerOperation
                        user={user}
                        params={params}
                        blog={blog}
                        comment={comment}
                        commentLoved={!!isLoved}
                    />

                    {replies.length > 0 && (
                        <button
                            className="flex items-center gap-1 rounded-full p-2 px-3 text-sm text-accent-foreground transition-all ease-in-out hover:bg-gray-800"
                            onClick={() => setShowReply(!showReply)}
                        >
                            <Icons.chevronDown
                                className={cn(
                                    "h-4 w-4 transition-all ease-in-out",
                                    showReply && "rotate-180"
                                )}
                            />
                            <p>
                                {replies.length}{" "}
                                {replies.length === 1 ? "reply" : "replies"}
                            </p>
                        </button>
                    )}
                </div>
                {user ? (
                    <BlogCommentOperation
                        user={user}
                        params={params}
                        comment={comment}
                    />
                ) : null}
            </div>
            {replies.length > 0 && showReply && (
                <div className="space-y-4">
                    {replies
                        .sort(
                            (a, b) =>
                                a.createdAt.getTime() - b.createdAt.getTime()
                        )
                        .map((reply) => (
                            <RecursiveComment
                                key={reply.id}
                                comment={reply}
                                user={user}
                                params={params}
                                blog={blog}
                                allComments={allComments}
                                isReply={true}
                                isPinned={false}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}

export default RecursiveComment;
