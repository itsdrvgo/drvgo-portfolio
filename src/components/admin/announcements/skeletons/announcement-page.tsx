"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Skeleton } from "@nextui-org/react";

function AnnouncementFormSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div className={cn("space-y-5", className)} {...props}>
            <div className="space-y-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-60 w-full rounded-lg" />
            </div>
        </div>
    );
}

export default AnnouncementFormSkeleton;
