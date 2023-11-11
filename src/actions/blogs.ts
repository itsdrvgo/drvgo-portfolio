"use server";

import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { blogs, likes, views } from "@/src/lib/drizzle/schema";
import {
    addBlogToCache,
    deleteBlogFromCache,
    updateBlogInCache,
} from "@/src/lib/redis/methods/blog";
import { hasPermission } from "@/src/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { ClerkUserWithoutEmail } from "../lib/validation/user";
import { CachedBlog } from "../types/cache";
import { addNotificationToUser } from "./notifications";

export async function handleBlogCreate() {
    const user = await currentUser();
    if (!user) throw new Error("You are not logged in!");

    const isUserAuthorized = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.ManageBlogs | BitFieldPermissions.ManagePages
    );
    if (!isUserAuthorized)
        throw new Error("You don't have permission to create a blog!");

    const id = nanoid();

    await Promise.all([
        db.insert(blogs).values({
            id,
            title: "Untitled",
            description: "",
            content: "",
            thumbnailUrl: null,
            authorId: user.id,
        }),
        addBlogToCache({
            id,
            title: "Untitled",
            content: "",
            thumbnailUrl: null,
            authorId: user.id,
            description: "",
            createdAt: new Date().toISOString(),
            updatedAt: null,
            published: false,
            likes: 0,
            views: 0,
            comments: 0,
        }),
    ]);

    return {
        id,
    };
}

export async function handleBlogPrivacy({ blog }: { blog: CachedBlog }) {
    await Promise.all([
        db
            .update(blogs)
            .set({
                published: !blog.published,
            })
            .where(eq(blogs.id, blog.id)),
        addBlogToCache({
            ...blog,
            published: !blog.published,
        }),
    ]);

    return {
        ...blog,
        published: !blog.published,
    };
}

export async function handleBlogUpdate({
    blog,
    props,
}: {
    blog: CachedBlog;
    props: {
        title: string;
        content: string;
        thumbnailUrl: string | null;
        description: string;
    };
}) {
    const { title, content, thumbnailUrl, description } = props;

    await Promise.all([
        db
            .update(blogs)
            .set({
                title,
                content,
                thumbnailUrl,
                description,
                updatedAt: blog.published
                    ? new Date()
                    : blog.updatedAt
                    ? new Date(blog.updatedAt)
                    : null,
            })
            .where(eq(blogs.id, blog.id)),
        addBlogToCache({
            ...blog,
            title,
            content,
            thumbnailUrl,
            description,
            updatedAt: blog.published
                ? new Date().toISOString()
                : blog.updatedAt,
        }),
    ]);

    return {
        ...blog,
        title,
        content,
        thumbnailUrl,
        description,
        updatedAt: blog.published ? new Date().toISOString() : blog.updatedAt,
    };
}

export async function handleBlogDelete({ blog }: { blog: CachedBlog }) {
    await Promise.all([
        db.delete(blogs).where(eq(blogs.id, blog.id)),
        deleteBlogFromCache(blog.id),
    ]);

    return {
        id: blog.id,
    };
}

export async function addLikeToBlog({
    blog,
    user,
}: {
    blog: CachedBlog;
    user: ClerkUserWithoutEmail;
}) {
    await Promise.all([
        db.insert(likes).values({
            id: nanoid(),
            userId: user.id,
            blogId: blog.id,
        }),
        updateBlogInCache({
            ...blog,
            likes: blog.likes + 1,
        }),
    ]);

    addNotificationToUser({
        title: "New like",
        content: `${user.username} liked your blog`,
        notifierId: user.id,
        receiverId: blog.authorId,
        type: "blogLike",
        props: {
            type: "blogLike",
            blogId: blog.id,
            blogThumbnailUrl: blog.thumbnailUrl!,
            blogTitle: blog.title,
        },
    });

    return {
        id: blog.id,
    };
}

export async function removeLikeFromBlog({
    blog,
    user,
}: {
    blog: CachedBlog;
    user: ClerkUserWithoutEmail;
}) {
    await Promise.all([
        db
            .delete(likes)
            .where(and(eq(likes.userId, user.id), eq(likes.blogId, blog.id))),
        updateBlogInCache({
            ...blog,
            likes: blog.likes - 1,
        }),
    ]);

    return {
        id: blog.id,
    };
}

export async function updateBlogViews({ blog }: { blog: CachedBlog }) {
    await Promise.all([
        db.insert(views).values({
            id: nanoid(),
            blogId: blog.id,
        }),
        updateBlogInCache({
            ...blog,
            views: blog.views + 1,
        }),
    ]);

    return {
        id: blog.id,
    };
}
