import { getBlogFromCache } from "@/src/lib/redis/methods/blog";
import { getAllRolesFromCache } from "@/src/lib/redis/methods/roles";
import { getUserFromCache } from "@/src/lib/redis/methods/user";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import BlogWriteUp from "./blog-edit-writeup";

interface PageProps extends DefaultProps {
    params: {
        blogId: string;
    };
}

async function BlogEditPage({ params, className, ...props }: PageProps) {
    const [roles, blog, user] = await Promise.all([
        getAllRolesFromCache(),
        getBlogFromCache(params.blogId),
        currentUser(),
    ]);

    if (!user) redirect("/auth");
    if (!blog) notFound();

    const author = await getUserFromCache(blog.authorId);
    if (!author) notFound();

    const parsedUser = userSchema
        .omit({
            emailAddresses: true,
        })
        .parse(user);

    return (
        <BlogWriteUp
            roles={roles}
            blog={blog}
            author={author}
            user={parsedUser}
            className={className}
            {...props}
        />
    );
}

export default BlogEditPage;
