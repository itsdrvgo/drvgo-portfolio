"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Skeleton } from "@nextui-org/react";

function ProjectFormSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col gap-3">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            <div className="flex flex-col gap-3">
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-36 w-full rounded-lg" />
            </div>

            <div className="flex flex-col gap-3">
                <Skeleton className="h-8 w-40 rounded-lg" />
                <Skeleton className="h-5 w-64 rounded-lg" />
                <Skeleton className="h-96 w-full rounded-lg" />
            </div>
        </div>
    );
}

export default ProjectFormSkeleton;
