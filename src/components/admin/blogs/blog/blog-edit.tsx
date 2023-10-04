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
    const [roles, blog] = await Promise.all([
        db.query.roles.findMany(),
        db.query.blogs.findFirst({
            where: eq(blogs.id, params.blogId),
            with: {
                author: {
                    with: {
                        account: true,
                    },
                },
            },
        }),
    ]);

    if (!blog) notFound();

    return <BlogWriteUp params={params} data={blog} roles={roles} />;
}

export default BlogEditPage;
