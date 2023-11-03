"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Skeleton } from "@nextui-org/react";

function ProjectsTableSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div className={cn("flex flex-col gap-4", className)} {...props}>
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-1/3 rounded-lg" />

                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-28 rounded-lg" />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-28 rounded-lg" />
                <Skeleton className="h-11 w-32 rounded-lg lg:w-60" />
            </div>

            <div>
                <Skeleton className="h-72 w-full rounded-lg" />
            </div>

            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-28 rounded-lg" />

                <Skeleton className="h-11 w-40 rounded-lg" />

                <div className="hidden items-center gap-2 lg:flex">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export default ProjectsTableSkeleton;
