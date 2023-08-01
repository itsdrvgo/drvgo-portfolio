import { db } from "@/src/lib/drizzle";
import { blogs, users } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import BlogWriteUp from "./blog-edit-writeup";

interface PageProps extends DefaultProps {
    params: {
        blogId: string;
    };
}

async function BlogEditPage({ params }: PageProps) {
    const blog = await db.query.blogs.findFirst({
        where: eq(blogs.id, Number(params.blogId)),
    });
    if (!blog) notFound();

    const author = await db.query.users.findFirst({
        where: eq(users.id, blog.authorId),
    });
    if (!author) redirect("/");

    return <BlogWriteUp params={params} data={blog} author={author} />;
}

export default BlogEditPage;
