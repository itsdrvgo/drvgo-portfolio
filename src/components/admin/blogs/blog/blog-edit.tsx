import { getBlogFromCache } from "@/src/lib/redis/methods/blog";
import { getAllRolesFromCache } from "@/src/lib/redis/methods/roles";
import { getUserFromCache } from "@/src/lib/redis/methods/user";
import { DefaultProps } from "@/src/types";
import { notFound } from "next/navigation";
import BlogWriteUp from "./blog-edit-writeup";

interface PageProps extends DefaultProps {
    params: {
        blogId: string;
    };
}

async function BlogEditPage({ params }: PageProps) {
    const [roles, blog] = await Promise.all([
        getAllRolesFromCache(),
        getBlogFromCache(params.blogId),
    ]);

    if (!blog) notFound();
    const author = await getUserFromCache(blog.authorId);
    if (!author) notFound();

    return <BlogWriteUp roles={roles} blog={blog} author={author} />;
}

export default BlogEditPage;
