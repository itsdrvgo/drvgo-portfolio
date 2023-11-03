"use client";

import { Skeleton } from "@nextui-org/react";

function BlogViewSkeleton() {
    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-36 rounded-lg" />
            </div>

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

export default BlogViewSkeleton;
