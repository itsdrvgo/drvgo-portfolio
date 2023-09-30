"use client";

import { DefaultProps } from "@/src/types";
import { Skeleton } from "@nextui-org/react";

function BlogEditSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div className="flex w-full flex-col gap-4">
            <Skeleton className="h-14 w-full rounded-md" />

            <div className="flex items-center gap-3 text-xs md:text-sm">
                <Skeleton className="h-14 w-14 rounded-full" />

                <div className="space-y-2">
                    <Skeleton className="h-7 w-28 rounded-md" />
                    <Skeleton className="h-7 w-44 rounded-md" />
                </div>
            </div>

            <Skeleton className="aspect-video rounded-md" />

            <Skeleton className="h-64 w-full rounded-md" />

            <Skeleton className="h-96 w-full rounded-md" />
        </div>
    );
}

export default BlogEditSkeleton;
