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
        where: and(
            eq(blogs.published, true),
            ne(blogs.id, Number(params.blogId))
        ),
        with: {
            author: true,
            comments: {
                with: {
                    user: true,
                },
            },
            likes: true,
            views: true,
        },
    });

    return <BlogNavItems data={allBlogs} />;
}

export default BlogNav;
