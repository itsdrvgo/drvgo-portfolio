import { CachedBlog } from "@/src/types/cache";
import { eq } from "drizzle-orm";
import { redis } from "..";
import { db } from "../../drizzle";
import { blogs } from "../../drizzle/schema";

export async function addBlogToCache(blog: CachedBlog) {
    await redis.set(`blog:${blog.id}`, JSON.stringify(blog));
}

export async function updateBlogInCache(blog: CachedBlog) {
    await redis.set(`blog:${blog.id}`, JSON.stringify(blog));
}

export async function deleteBlogFromCache(id: string) {
    await redis.del(`blog:${id}`);
}

export async function getBlogFromCache(id: string) {
    const cachedBlog = await redis.get<CachedBlog | null>(`blog:${id}`);
    if (!cachedBlog) {
        const blog = await db.query.blogs.findFirst({
            where: eq(blogs.id, id),
            with: {
                likes: true,
                views: true,
                comments: true,
            },
        });
        if (!blog) return null;

        const cachableBlog: CachedBlog = {
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
        };

        await addBlogToCache(cachableBlog);
        return cachableBlog;
    }

    return cachedBlog;
}

export async function getAllBlogsFromCache() {
    const keys = await redis.keys("blog:*");
    if (!keys.length) {
        const blogs = await db.query.blogs.findMany({
            with: {
                likes: true,
                views: true,
                comments: true,
            },
        });
        if (!blogs.length) return [];

        const cachableBlogs: CachedBlog[] = blogs.map((blog) => ({
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
        }));

        const pipeline = redis.pipeline();
        cachableBlogs.forEach((blog) => {
            pipeline.set(`blog:${blog.id}`, JSON.stringify(blog));
        });

        await pipeline.exec();
        return cachableBlogs;
    }

    const blogs = await redis.mget<CachedBlog[]>(...keys);
    return blogs;
}
