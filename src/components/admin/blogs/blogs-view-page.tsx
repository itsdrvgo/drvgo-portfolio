import { getAllBlogsFromCache } from "@/src/lib/redis/methods/blog";
import { cn } from "@/src/lib/utils";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import BlogCreateButton from "../../global/buttons/blog-create-button";
import { EmptyPlaceholder } from "../../ui/empty-placeholder";
import BlogItem from "./blog-item";

async function BlogsPage({ className }: DefaultProps) {
    const user = await currentUser();
    if (!user) redirect("/auth");

    const parsedUser = userSchema
        .omit({
            emailAddresses: true,
        })
        .parse(user);

    const blogs = await getAllBlogsFromCache();
    const sortedBlogs = blogs.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <>
            {sortedBlogs.length ? (
                <div
                    className={cn(
                        "grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3",
                        className
                    )}
                >
                    {sortedBlogs.map((blog) => (
                        <BlogItem key={blog.id} blog={blog} user={parsedUser} />
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
        </>
    );
}

export default BlogsPage;
