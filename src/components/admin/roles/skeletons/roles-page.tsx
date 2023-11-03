"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Skeleton } from "@nextui-org/react";

function RolesPageSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div
            className={cn("flex flex-col items-center gap-5", className)}
            {...props}
        >
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}

            <div className="flex items-center justify-center">
                <Skeleton className="h-10 w-40 rounded-lg" />
            </div>
        </div>
    );
}

export default RolesPageSkeleton;
