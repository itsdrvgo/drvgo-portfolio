import { db } from "@/src/lib/drizzle";
import { comments, likes } from "@/src/lib/drizzle/schema";
import { getBlogFromCache } from "@/src/lib/redis/methods/blog";
import { getAllRolesFromCache } from "@/src/lib/redis/methods/roles";
import { getUserFromCache } from "@/src/lib/redis/methods/user";
import { cn } from "@/src/lib/utils";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { and, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import BlogViewPage from "./blog-view-page";

interface PageProps extends DefaultProps {
    params: {
        blogId: string;
    };
}

async function BlogViewFetch({ params, className }: PageProps) {
    const user = await currentUser();

    const [roles, blog, likedBlog, blogComments] = await Promise.all([
        getAllRolesFromCache(),
        getBlogFromCache(params.blogId),
        user &&
            db.query.likes.findFirst({
                where: and(
                    eq(likes.userId, user.id),
                    eq(likes.blogId, params.blogId)
                ),
            }),
        db.query.comments.findMany({
            where: eq(comments.blogId, params.blogId),
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
        }),
    ]);

    if (!blog) notFound();

    const author = await getUserFromCache(blog.authorId);
    if (!author) notFound();

    const parsedUser = user
        ? userSchema
              .omit({
                  emailAddresses: true,
              })
              .parse(user)
        : null;
    const blogIsLiked = likedBlog ? true : false;

    return (
        <BlogViewPage
            className={cn("", className)}
            blog={blog}
            comments={blogComments}
            author={author}
            user={parsedUser}
            blogIsLiked={blogIsLiked}
            roles={roles}
        />
    );
}

export default BlogViewFetch;
