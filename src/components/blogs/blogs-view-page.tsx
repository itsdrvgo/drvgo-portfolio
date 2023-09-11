import { db } from "@/src/lib/drizzle";
import { blogs, comments } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "../md/mdx-comp";
import { Separator } from "../ui/separator";
import BlogAuthor from "./blog-author";
import BlogImage from "./blog-image";
import BlogViewOperations from "./blog-view-operations";

interface PageProps extends DefaultProps {
    params: {
        blogId: string;
    };
}

async function BlogViewPage({ params, className }: PageProps) {
    const user = await currentUser();

    const blog = await db.query.blogs.findFirst({
        with: {
            author: true,
            comments: {
                orderBy: [desc(comments.createdAt)],
                with: {
                    user: true,
                    loves: true,
                    blog: true,
                },
            },
            likes: true,
            views: true,
        },
        where: eq(blogs.id, params.blogId),
    });

    if (!blog) notFound();

    const userData = user ? userSchema.parse(user) : null;

    const blogIsLiked = user
        ? blog.likes.find((like) => like.userId === user.id)
            ? true
            : false
        : false;

    return (
        <article
            className={cn(
                "relative flex flex-col items-center gap-3",
                className
            )}
        >
            <div className="flex w-full flex-col gap-4">
                <p className="text-xl font-bold md:text-5xl md:leading-tight">
                    {blog.title}
                </p>

                <Separator className="w-full" />

                <BlogAuthor blog={blog} />
                <BlogImage blog={blog} />

                {blog.content?.split("\n").length! > 1 ? (
                    <div className="flex cursor-default flex-col gap-4 rounded-md border border-gray-400 bg-stone-950 p-5">
                        <p className="text-lg font-bold underline underline-offset-4 md:text-xl">
                            Table of Contents
                        </p>

                        <ol className="list-disc space-y-1 px-5 text-sm md:text-base">
                            {blog.content?.split("\n").map((x, index) => {
                                if (x.startsWith("## ")) {
                                    return (
                                        <li key={index}>
                                            <Link
                                                href={`#${x
                                                    .replace("## ", "")
                                                    .replace(/:$/, "")
                                                    .toLowerCase()
                                                    .replace(/\s/g, "-")}`}
                                                className="text-gray-300 transition-all ease-in-out hover:text-white"
                                            >
                                                {x
                                                    .replace("## ", "")
                                                    .replace(/:$/, "")}
                                            </Link>
                                        </li>
                                    );
                                } else if (x.startsWith("### ")) {
                                    return (
                                        <li key={index} className="ml-5">
                                            <Link
                                                href={`#${x
                                                    .replace("### ", "")
                                                    .replace(/:$/, "")
                                                    .toLowerCase()
                                                    .replace(/\s/g, "-")}`}
                                                className="text-gray-400 transition-all ease-in-out hover:text-gray-300"
                                            >
                                                {x
                                                    .replace("### ", "")
                                                    .replace(/:$/, "")}
                                            </Link>
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </ol>
                    </div>
                ) : null}
                <Mdx className="prose prose-lg max-w-full text-sm text-white md:text-base">
                    {blog.content!}
                </Mdx>
            </div>

            <Separator className="w-full" />

            <BlogViewOperations
                params={params}
                blog={blog}
                user={userData}
                blogIsLiked={blogIsLiked}
            />
        </article>
    );
}

export default BlogViewPage;
