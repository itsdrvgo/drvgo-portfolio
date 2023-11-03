"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Divider, Skeleton } from "@nextui-org/react";

function AnnouncementSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div className={cn("flex flex-col gap-5", className)} {...props}>
            <Skeleton className="h-10 w-1/2 rounded-lg" />

            <Divider />

            <Skeleton className="aspect-video rounded-lg" />

            <Divider />

            <Skeleton className="h-40 w-full rounded-lg" />
        </div>
    );
}

export default AnnouncementSkeleton;
