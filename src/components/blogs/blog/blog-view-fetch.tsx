import { db } from "@/src/lib/drizzle";
import { blogs, comments } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import BlogViewPage from "./blog-view-page";

interface PageProps extends DefaultProps {
    params: {
        blogId: string;
    };
}

async function BlogViewFetch({ params, className }: PageProps) {
    const user = await currentUser();

    const [roles, blog] = await Promise.all([
        db.query.roles.findMany(),
        db.query.blogs.findFirst({
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
            where: eq(blogs.id, params.blogId),
        }),
    ]);

    if (!blog) notFound();

    const userData = user ? userSchema.parse(user) : null;

    const blogIsLiked = !!(
        user && blog.likes.find((like) => like.userId === user.id)
    );

    return (
        <BlogViewPage
            className={cn("", className)}
            blog={blog}
            user={userData}
            blogIsLiked={blogIsLiked}
            params={params}
            roles={roles}
        />
    );
}

export default BlogViewFetch;
