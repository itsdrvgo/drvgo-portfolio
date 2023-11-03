"use client";

import { cn } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedComment } from "@/src/types";
import { CachedBlog, CachedRole, CachedUser } from "@/src/types/cache";
import { Divider, Link } from "@nextui-org/react";
import NextLink from "next/link";
import BlogAuthor from "../../global/blogs/blog-author";
import BlogImage from "../../global/blogs/blog-image";
import { Mdx } from "../../md/mdx-comp";
import BlogViewOperations from "./blog-view-operations";

interface PageProps extends DefaultProps {
    blog: CachedBlog;
    user: ClerkUserWithoutEmail | null;
    blogIsLiked: boolean;
    roles: CachedRole[];
    comments: ExtendedComment[];
    author: CachedUser;
}

function BlogViewPage({
    className,
    blog,
    user,
    blogIsLiked,
    roles,
    comments,
    author,
}: PageProps) {
    const authorRolesRaw = author.roles.map((x) => {
        const role = roles.find((r) => r.key === x);
        if (!role) return null;
        return role;
    });

    const authorHighestRole = authorRolesRaw.reduce((prev, curr) => {
        if (!prev) return curr;
        if (!curr) return prev;
        return prev.position > curr.position ? curr : prev;
    }, null);

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

                <Divider />

                <BlogAuthor
                    authorName={author.username}
                    createdAt={blog.createdAt}
                    image={author.image ?? undefined}
                    updatedAt={blog.updatedAt ?? undefined}
                    authorRole={authorHighestRole}
                />
                <BlogImage src={blog.thumbnailUrl!} />

                {blog.content?.split("\n").length! > 1 ? (
                    <div className="flex cursor-default flex-col gap-4 rounded-lg border border-gray-400 bg-stone-950 p-5">
                        <p className="text-lg font-bold underline underline-offset-4 md:text-xl">
                            Table of Contents
                        </p>

                        <ol className="list-disc space-y-1 px-5 text-sm md:text-base">
                            {blog.content?.split("\n").map((x, index) => {
                                if (x.startsWith("## ")) {
                                    return (
                                        <li key={index}>
                                            <Link
                                                as={NextLink}
                                                color="foreground"
                                                href={`#${x
                                                    .replace("## ", "")
                                                    .replace(/:$/, "")
                                                    .toLowerCase()
                                                    .replace(/\s/g, "-")}`}
                                            >
                                                {x
                                                    .replace("## ", "")
                                                    .replace(/:$/, "")}
                                            </Link>
                                        </li>
                                    );
                                } else if (x.startsWith("### ")) {
                                    return (
                                        <li
                                            key={index}
                                            className="ml-5 text-gray-500"
                                        >
                                            <Link
                                                as={NextLink}
                                                color="foreground"
                                                href={`#${x
                                                    .replace("### ", "")
                                                    .replace(/:$/, "")
                                                    .toLowerCase()
                                                    .replace(/\s/g, "-")}`}
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

                <div>
                    <Mdx>{blog.content!}</Mdx>
                </div>
            </div>

            <Divider />

            <BlogViewOperations
                blog={blog}
                user={user}
                blogIsLiked={blogIsLiked}
                roles={roles}
                comments={comments}
                author={author}
            />
        </article>
    );
}

export default BlogViewPage;
