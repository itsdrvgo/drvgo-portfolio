import { getAllBlogsFromCache } from "@/src/lib/redis/methods/blog";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import GoBackButton from "../global/buttons/go-back-button";
import { EmptyPlaceholder } from "../ui/empty-placeholder";
import BlogSearch from "./blog-search";

async function BlogsPage({ className }: DefaultProps) {
    const blogs = await getAllBlogsFromCache();
    const publishedBlogs = blogs
        .filter((blog) => blog.published)
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );

    return (
        <>
            {publishedBlogs.length ? (
                <BlogSearch
                    blogs={publishedBlogs}
                    className={cn("", className)}
                />
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
