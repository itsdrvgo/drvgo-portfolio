"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { cn, formatDate } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { CachedRole } from "@/src/types/cache";
import { Avatar, Chip, Tooltip } from "@nextui-org/react";

interface PageProps extends DefaultProps {
    image?: string;
    authorName: string;
    createdAt: string;
    updatedAt?: string;
    authorRole: CachedRole | null;
}

function BlogAuthor({
    className,
    image,
    authorName,
    createdAt,
    updatedAt,
    authorRole,
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
                <div className="flex items-center gap-2">
                    <p>@{authorName}</p>

                    <Chip color="primary" size="sm">
                        {authorRole?.name ?? "User"}
                    </Chip>
                </div>

                <div className="flex gap-1 text-sm text-gray-600">
                    <p>Published on {formatDate(createdAt)}</p>

                    {updatedAt ? (
                        <Tooltip content={formatDate(updatedAt)} radius="sm">
                            <p>(Updated)</p>
                        </Tooltip>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default BlogAuthor;
