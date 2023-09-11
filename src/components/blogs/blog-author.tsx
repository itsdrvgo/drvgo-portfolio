"use client";

import { defaultUserPFP } from "@/src/config/const";
import { cn, formatDate } from "@/src/lib/utils";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import { Avatar, Tooltip } from "@nextui-org/react";

interface PageProps extends DefaultProps {
    blog: ExtendedBlog;
}

function BlogAuthor({ blog, className }: PageProps) {
    return (
        <div className={cn("flex items-center gap-4", className)}>
            <Avatar
                isBordered
                showFallback
                as="span"
                size="md"
                src={blog.author.image || defaultUserPFP.src}
            />
            <div className="space-y-1">
                <p>@{blog.author.username}</p>

                <div className="flex gap-1 text-sm text-gray-600">
                    <p>Published on {formatDate(blog.createdAt.getTime())}</p>

                    {blog.updatedAt ? (
                        <Tooltip
                            content={formatDate(blog.updatedAt.getTime())}
                            radius="sm"
                        >
                            <p>(Updated)</p>
                        </Tooltip>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default BlogAuthor;
