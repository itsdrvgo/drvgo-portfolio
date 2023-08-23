import { db } from "@/src/lib/drizzle";
import { blogs, comments } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
import { desc, eq } from "drizzle-orm";
import { EmptyPlaceholder } from "../global/empty-placeholder";
import { GoBackButton } from "../global/go-back-button";
import BlogSearch from "./blog-search";

async function BlogsPage({ className }: DefaultProps) {
    const blogData = await db.query.blogs.findMany({
        with: {
            author: true,
            comments: {
                orderBy: [desc(comments.createdAt)],
                with: {
                    user: true,
                    loves: true,
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
                <BlogSearch blogData={blogData} />
            ) : (
                <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="document" />
                    <EmptyPlaceholder.Title>
                        No blogs created
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        No blogs have been written yet, come back later
                    </EmptyPlaceholder.Description>
                    <GoBackButton />
                </EmptyPlaceholder>
            )}
        </>
    );
}

export default BlogsPage;
