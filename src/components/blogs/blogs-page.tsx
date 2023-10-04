import { db } from "@/src/lib/drizzle";
import { blogs, comments } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { desc, eq } from "drizzle-orm";
import GoBackButton from "../global/buttons/go-back-button";
import { EmptyPlaceholder } from "../ui/empty-placeholder";
import BlogSearch from "./blog-search";

async function BlogsPage({ className }: DefaultProps) {
    const blogData = await db.query.blogs.findMany({
        with: {
            author: {
                with: {
                    account: true,
                },
            },
            comments: {
                orderBy: [desc(comments.createdAt)],
                with: {
                    user: {
                        with: {
                            account: true,
                        },
                    },
                    loves: true,
                    blog: true,
                },
            },
            likes: true,
            views: true,
        },
        where: eq(blogs.published, true),
        orderBy: [desc(blogs.createdAt)],
    });

    return (
        <>
            {blogData.length ? (
                <BlogSearch blogData={blogData} className={cn("", className)} />
            ) : (
                <div className="flex items-center justify-center">
                    <EmptyPlaceholder
                        icon="document"
                        title="No blogs created"
                        description="No blogs have been written yet, come back later."
                        endContent={<GoBackButton />}
                    />
                </div>
            )}
        </>
    );
}

export default BlogsPage;
