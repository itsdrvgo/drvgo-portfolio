import { getAllBlogsFromCache } from "@/src/lib/redis/methods/blog";
import { cn } from "@/src/lib/utils";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import BlogCreateButton from "../../global/buttons/blog-create-button";
import { EmptyPlaceholder } from "../../ui/empty-placeholder";
import BlogItem from "./blog-item";
import BlogFAQ from "./blogs-faq";

async function BlogsPage({ className }: DefaultProps) {
    const [user, blogs] = await Promise.all([
        currentUser(),
        getAllBlogsFromCache(),
    ]);
    blogs.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (!user) redirect("/auth");
    const parsedUser = userSchema.parse(user);

    return (
        <>
            {blogs.length ? (
                <div
                    className={cn(
                        "grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3",
                        className
                    )}
                >
                    {blogs.map((blog) => (
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

            <BlogFAQ />
        </>
    );
}

export default BlogsPage;
