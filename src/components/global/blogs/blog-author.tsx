"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { cn, formatDate } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Avatar, Tooltip } from "@nextui-org/react";

interface PageProps extends DefaultProps {
    image?: string;
    authorName: string;
    createdAt: Date;
    updatedAt?: Date;
}

function BlogAuthor({
    className,
    image,
    authorName,
    createdAt,
    updatedAt,
    ...props
}: PageProps) {
    return (
        <div className={cn("flex items-center gap-4", className)} {...props}>
            <Avatar
                isBordered
                showFallback
                as="span"
                size="md"
                src={image || DEFAULT_USER_IMAGE.src}
            />
            <div className="space-y-1">
                <p>@{authorName}</p>

                <div className="flex gap-1 text-sm text-gray-600">
                    <p>Published on {formatDate(createdAt.getTime())}</p>

                    {updatedAt ? (
                        <Tooltip
                            content={formatDate(updatedAt.getTime())}
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
