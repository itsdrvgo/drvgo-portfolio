"use client";

import { DefaultProps } from "@/src/types";
import { Skeleton } from "@nextui-org/react";

function AnnouncementFormSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-80 w-full rounded-md" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-60 w-full rounded-md" />
            </div>
        </div>
    );
}

export default AnnouncementFormSkeleton;
