"use server";

import { db } from "../lib/drizzle";
import { redis } from "../lib/redis";

export async function revalidateBlogs() {
    const blogs = await db.query.blogs.findMany({
        with: {
            likes: true,
            views: true,
            comments: true,
        },
    });

    const pipeline = redis.pipeline();
    blogs
        .map((blog) => ({
            id: blog.id,
            title: blog.title,
            thumbnailUrl: blog.thumbnailUrl,
            description: blog.description,
            content: blog.content,
            createdAt: blog.createdAt.toISOString(),
            updatedAt: blog.updatedAt?.toISOString() ?? null,
            authorId: blog.authorId,
            published: blog.published,
            likes: blog.likes.length,
            views: blog.views.length,
            comments: blog.comments.length,
        }))
        .forEach((blog) => {
            pipeline.set(`blog:${blog.id}`, JSON.stringify(blog));
        });

    await pipeline.exec();
    return {
        blogs,
    };
}

export async function revalidateRoles() {
    const roles = await db.query.roles.findMany();

    const pipeline = redis.pipeline();
    roles
        .map((role) => ({
            id: role.id,
            name: role.name,
            key: role.key,
            position: role.position,
            permissions: role.permissions,
            createdAt: role.createdAt.toISOString(),
            updatedAt: role.updatedAt?.toISOString() ?? null,
        }))
        .forEach((role) => {
            pipeline.set(`role:${role.id}`, JSON.stringify(role));
        });

    await pipeline.exec();
    return {
        roles,
    };
}

export async function revalidateUsers() {
    const users = await db.query.users.findMany({
        with: {
            account: true,
        },
    });

    const pipeline = redis.pipeline();
    users
        .map((user) => ({
            id: user.id,
            username: user.username,
            image: user.image,
            createdAt: user.createdAt.toISOString(),
            email: user.email,
            permissions: user.account.permissions,
            roles: user.account.roles,
            strikes: user.account.strikes,
            updatedAt: user.updatedAt.toISOString(),
        }))
        .forEach((user) => {
            pipeline.set(`user:${user.id}`, JSON.stringify(user));
            pipeline.sadd("usernames", user.username);
        });

    await pipeline.exec();
    return {
        users,
    };
}
