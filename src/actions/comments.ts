"use server";

import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../lib/drizzle";
import { commentLoves, comments } from "../lib/drizzle/schema";
import { updateBlogInCache } from "../lib/redis/methods/blog";
import { ClerkUserWithoutEmail } from "../lib/validation/user";
import { ExtendedComment } from "../types";
import { CachedBlog } from "../types/cache";
import { addNotificationToUser } from "./notifications";

export async function createComment({
    content,
    blog,
    user,
}: {
    content: string;
    blog: CachedBlog;
    user: ClerkUserWithoutEmail;
}) {
    const commentId = nanoid();

    await Promise.all([
        db.insert(comments).values({
            id: commentId,
            blogId: blog.id,
            authorId: user.id,
            content,
        }),
        updateBlogInCache({
            ...blog,
            comments: blog.comments + 1,
        }),
    ]);

    addNotificationToUser({
        title: "New comment",
        content: `${user.username} commented on your blog`,
        notifierId: user.id,
        receiverId: blog.authorId,
        type: "blogComment",
        props: {
            type: "blogComment",
            blogId: blog.id,
            blogThumbnailUrl: blog.thumbnailUrl!,
            commentContent: content,
            commentId,
        },
    });

    return {
        id: commentId,
    };
}

export async function replyToComment({
    user,
    comment,
    blog,
    content,
}: {
    comment: ExtendedComment;
    blog: CachedBlog;
    user: ClerkUserWithoutEmail;
    content: string;
}) {
    const {
        authorId,
        id,
        content: _content,
        createdAt,
        updatedAt,
        title,
        description,
        thumbnailUrl,
        published,
        likes,
        views,
        comments: _comments,
    } = blog;

    const replyId = nanoid();

    await Promise.all([
        db.insert(comments).values({
            id: replyId,
            authorId: user.id,
            blogId: comment.blogId,
            content,
            parentId: comment.id,
        }),
        updateBlogInCache({
            authorId,
            id,
            content: _content,
            description,
            thumbnailUrl,
            createdAt: createdAt,
            updatedAt: updatedAt ?? null,
            title,
            published,
            likes,
            views,
            comments: _comments + 1,
        }),
    ]);

    addNotificationToUser({
        title: "Comment replied",
        content: `@${user.username} replied to your comment`,
        notifierId: user.id,
        receiverId: comment.authorId,
        type: "blogCommentReply",
        props: {
            type: "blogCommentReply",
            blogId: id,
            commentId: comment.id,
            blogThumbnailUrl: thumbnailUrl!,
            commentContent: comment.content,
            replyContent: content,
            replyId,
        },
    });

    return {
        id: replyId,
    };
}

export async function deleteComment({
    comment,
    blog,
}: {
    comment: ExtendedComment;
    blog: CachedBlog;
}) {
    if (comment.parentId === null) {
        const [replies] = await Promise.all([
            // Finding all the child/replies of the comment
            db.query.comments.findMany({
                where: eq(comments.parentId, comment.id),
            }),
            // Deleting the root comment
            db.delete(comments).where(eq(comments.id, comment.id)),
            // Deleting all the replies
            db.delete(comments).where(eq(comments.parentId, comment.id)),
            // Deleting all the comment loves of the root comment
            db
                .delete(commentLoves)
                .where(eq(commentLoves.commentId, comment.id)),
        ]);

        await Promise.all([
            // Deleting all the comment loves of the replies
            replies.map((reply) =>
                db
                    .delete(commentLoves)
                    .where(eq(commentLoves.commentId, reply.id))
            ),
            updateBlogInCache({
                ...blog,
                comments: blog.comments - replies.length - 1,
            }),
        ]);
    } else {
        await Promise.all([
            db.delete(comments).where(eq(comments.id, comment.id)),
            db
                .delete(commentLoves)
                .where(and(eq(commentLoves.commentId, comment.id))),
        ]);
    }

    return {
        id: comment.id,
    };
}

export async function updateComment({
    comment,
    content,
}: {
    comment: ExtendedComment;
    content: string;
}) {
    await db
        .update(comments)
        .set({ content, edited: true })
        .where(eq(comments.id, comment.id));

    return {
        id: comment.id,
    };
}

export async function loveComment({
    user,
    comment,
}: {
    user: ClerkUserWithoutEmail;
    comment: ExtendedComment;
}) {
    const loveId = nanoid();

    await db.insert(commentLoves).values({
        id: loveId,
        userId: user.id,
        commentId: comment.id,
    });

    addNotificationToUser({
        title: "Comment loved",
        content: `@${user.username} loved your comment`,
        notifierId: user.id,
        receiverId: comment.authorId,
        type: "blogCommentLove",
        props: {
            type: "blogCommentLove",
            blogId: comment.blog.id,
            commentId: comment.id,
            blogThumbnailUrl: comment.blog.thumbnailUrl!,
            commentContent: comment.content,
        },
    });

    return {
        id: loveId,
    };
}

export async function unloveComment({
    user,
    comment,
}: {
    user: ClerkUserWithoutEmail;
    comment: ExtendedComment;
}) {
    await db
        .delete(commentLoves)
        .where(
            and(
                eq(commentLoves.userId, user.id),
                eq(commentLoves.commentId, comment.id)
            )
        );

    return {
        id: comment.id,
    };
}

export async function pinComment({
    user,
    comment,
}: {
    user: ClerkUserWithoutEmail;
    comment: ExtendedComment;
}) {
    const existingPin = await db.query.comments.findFirst({
        where: and(
            eq(comments.pinned, true),
            eq(comments.blogId, comment.blogId)
        ),
    });

    if (existingPin) {
        await db
            .update(comments)
            .set({
                pinned: false,
            })
            .where(eq(comments.id, existingPin.id));
    }

    await db
        .update(comments)
        .set({
            pinned: true,
        })
        .where(eq(comments.id, comment.id));

    addNotificationToUser({
        title: "Comment Pinned",
        content: `Your comment on '${comment.blog.title}' has been pinned`,
        notifierId: user.id,
        receiverId: comment.authorId,
        type: "blogCommentPin",
        props: {
            type: "blogCommentPin",
            blogId: comment.blogId,
            commentId: comment.id,
            blogThumbnailUrl: comment.blog.thumbnailUrl!,
            commentContent: comment.content,
        },
    });

    return {
        id: comment.id,
    };
}

export async function unpinComment({ comment }: { comment: ExtendedComment }) {
    await db
        .update(comments)
        .set({
            pinned: false,
        })
        .where(eq(comments.id, comment.id));

    return {
        id: comment.id,
    };
}
