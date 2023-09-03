import { db } from "@/src/lib/drizzle";
import { blogs } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
import { desc } from "drizzle-orm";
import { EmptyPlaceholder } from "../../global/empty-placeholder";
import { Separator } from "../../ui/separator";
import { BlogCreateButton } from "./blog-create-button";
import { BlogItem } from "./blog-item";
import FAQAccordian from "./faq";

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
                <div className={className}>
                    {data.map((blog) => (
                        <BlogItem key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="document" />
                    <EmptyPlaceholder.Title>
                        No blogs created
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        You don&apos;t have any blogs yet. Start creating
                        content.
                    </EmptyPlaceholder.Description>
                    <BlogCreateButton variant="outline" />
                </EmptyPlaceholder>
            )}
            <div className="space-y-4">
                <p className="text-4xl font-bold">F.A.Q.</p>
                <Separator className="h-[2px] w-12 bg-blue-300" />
                <FAQAccordian className="w-full text-left" />
            </div>
        </>
    );
}

export default BlogsPage;
