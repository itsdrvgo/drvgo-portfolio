import { BitFieldPermissions, DEFAULT_USER_IMAGE } from "@/src/config/const";
import { cn, convertMstoTimeElapsed, hasPermission } from "@/src/lib/utils";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedComment } from "@/src/types";
import { CachedBlog, CachedRole, CachedUser } from "@/src/types/cache";
import { Avatar, Button, Chip } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons } from "../../icons/icons";
import BlogCommentOperation from "./blog-comment-operation";
import BlogCommentViewerOperation from "./blog-comment-viewer-operations";

interface PageProps extends DefaultProps {
    blog: CachedBlog;
    user: ClerkUser | null;
    comment: ExtendedComment;
    comments: ExtendedComment[];
    isReply: boolean;
    isPinned: boolean;
    roles: CachedRole[];
    author: CachedUser;
}

function RecursiveComment({
    comment,
    user,
    blog,
    comments,
    isReply = false,
    isPinned = false,
    className,
    id,
    roles,
    author,
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

    const replies = comments.filter((c) => c.parentId === comment.id);
    const isLoved = comment.loves.find((love) => love.userId === user?.id);

    const commenterRolesRaw = comment.user.account.roles.map((x) => {
        const role = roles.find((r) => r.key === x);
        if (!role) return null;
        return role;
    });

    const commenterHighestRole = commenterRolesRaw.reduce((prev, curr) => {
        if (!prev) return curr;
        if (!curr) return prev;
        return prev.position > curr.position ? curr : prev;
    }, null);

    return (
        <div
            className={cn(
                "space-y-5 transition-all ease-in-out",
                className,
                isHighlighted &&
                    "rounded-md border border-accent bg-gray-800 p-2"
            )}
            id={id}
        >
            <div className={cn("flex items-start gap-4", isReply && "ml-12")}>
                <div>
                    <Avatar
                        isBordered
                        showFallback
                        as="span"
                        alt={comment.user.username}
                        size="md"
                        src={comment.user.image ?? DEFAULT_USER_IMAGE.src}
                    />
                </div>

                <div className="w-full cursor-default space-y-2">
                    {isPinned && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Icons.pin className="h-4 w-4" />
                            <p>Pinned by @{author.username}</p>
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

                        {commenterHighestRole?.key !== "user" && (
                            <Chip
                                color={
                                    hasPermission(
                                        comment.user.account.permissions,
                                        BitFieldPermissions.Administrator
                                    )
                                        ? "primary"
                                        : hasPermission(
                                              comment.user.account.permissions,
                                              BitFieldPermissions.ManagePages
                                          )
                                        ? "success"
                                        : hasPermission(
                                              comment.user.account.permissions,
                                              BitFieldPermissions.ManageBlogs
                                          )
                                        ? "danger"
                                        : "default"
                                }
                                size="sm"
                            >
                                {commenterHighestRole?.name ?? "User"}
                            </Chip>
                        )}

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
                                    comments.find(
                                        (c) => c.id === comment.parentId
                                    )?.user.username
                                }
                            </span>
                        )}
                        {comment.content}
                    </p>
                    <BlogCommentViewerOperation
                        user={user}
                        blog={blog}
                        comment={comment}
                        commentLoved={!!isLoved}
                    />

                    {replies.length > 0 && (
                        <Button
                            radius="full"
                            size="sm"
                            className="bg-transparent text-sm text-accent transition-all ease-in-out hover:bg-gray-800"
                            onPress={() => setShowReply(!showReply)}
                            startContent={
                                <Icons.chevronDown
                                    className={cn(
                                        "h-4 w-4 transition-all ease-in-out",
                                        showReply && "rotate-180"
                                    )}
                                />
                            }
                        >
                            {replies.length}{" "}
                            {replies.length === 1 ? "reply" : "replies"}
                        </Button>
                    )}
                </div>

                {user ? (
                    <BlogCommentOperation
                        blog={blog}
                        user={user}
                        comment={comment}
                    />
                ) : null}
            </div>

            {replies.length > 0 && showReply ? (
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
                                blog={blog}
                                comments={comments}
                                isReply={true}
                                isPinned={false}
                                roles={roles}
                                author={author}
                            />
                        ))}
                </div>
            ) : null}
        </div>
    );
}

export default RecursiveComment;
