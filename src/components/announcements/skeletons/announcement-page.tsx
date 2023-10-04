"use client";

import { DefaultProps } from "@/src/types";
import { Divider, Skeleton } from "@nextui-org/react";

function AnnouncementSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div className="flex flex-col gap-5">
            <Skeleton className="h-10 w-1/2 rounded-md" />

            <Divider />

            <Skeleton className="aspect-video rounded-md" />

            <Divider />

            <Skeleton className="h-40 w-full rounded-md" />
        </div>
    );
}

export default AnnouncementSkeleton;
