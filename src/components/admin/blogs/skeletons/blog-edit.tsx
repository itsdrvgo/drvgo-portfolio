"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Skeleton } from "@nextui-org/react";

function BlogEditSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div className={cn("flex w-full flex-col gap-4", className)} {...props}>
            <Skeleton className="h-14 w-full rounded-lg" />

            <div className="flex items-center gap-3 text-xs lg:text-sm">
                <Skeleton className="h-14 w-14 rounded-full" />

                <div className="space-y-2">
                    <Skeleton className="h-7 w-28 rounded-lg" />
                    <Skeleton className="h-7 w-44 rounded-lg" />
                </div>
            </div>

            <Skeleton className="aspect-video rounded-lg" />

            <Skeleton className="h-64 w-full rounded-lg" />

            <Skeleton className="h-96 w-full rounded-lg" />
        </div>
    );
}

export default BlogEditSkeleton;
