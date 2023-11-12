import { db } from "@/src/lib/drizzle";
import { blogs } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
import { and, eq, ne } from "drizzle-orm";
import BlogNavItems from "./blogs-nav-items";

interface PageProps extends DefaultProps {
    params: {
        blogId: string;
    };
}

async function BlogNav({ params }: PageProps) {
    const allBlogs = await db.query.blogs.findMany({
        limit: 6,
        where: and(eq(blogs.published, true), ne(blogs.id, params.blogId)),
        with: {
            comments: true,
            likes: true,
            views: true,
        },
    });

    const data = allBlogs.map((blog) => ({
        ...blog,
        likes: blog.likes.length,
        comments: blog.comments.length,
        views: blog.views.length,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : null,
    }));

    return <BlogNavItems data={data} />;
}

export default BlogNav;
