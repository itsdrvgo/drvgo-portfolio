import { db } from "@/src/lib/drizzle";
import { blogs } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { desc, eq } from "drizzle-orm";
import BlogCreateButton from "../../global/buttons/blog-create-button";
import { EmptyPlaceholder } from "../../ui/empty-placeholder";
import BlogItem from "./blog-item";
import BlogFAQ from "./blogs-faq";

async function BlogsPage({ className }: DefaultProps) {
    const data = await db.query.blogs.findMany({
        orderBy: [desc(blogs.createdAt)],
        with: {
            author: true,
            likes: true,
            views: true,
            comments: {
                with: {
                    blog: true,
                    loves: true,
                    user: true,
                },
            },
        },
    });

    return (
        <>
            {data.length ? (
                <div
                    className={cn(
                        "grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3",
                        className
                    )}
                >
                    {data.map((blog) => (
                        <BlogItem key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <EmptyPlaceholder
                    icon="document"
                    title="No blogs created"
                    description="You don't have any blogs yet. Start creating content."
                    endContent={<BlogCreateButton />}
                />
            )}

            <BlogFAQ />
        </>
    );
}

export default BlogsPage;
