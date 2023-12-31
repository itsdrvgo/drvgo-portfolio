"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Skeleton } from "@nextui-org/react";

function RoleFormSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div className={cn("flex flex-col gap-8", className)} {...props}>
            <div className="flex flex-col gap-5">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            <div className="flex flex-col gap-5">
                <Skeleton className="h-8 w-24 rounded-lg" />

                <div className="flex flex-col gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center">
                <Skeleton className="h-10 w-40 rounded-lg" />
            </div>
        </div>
    );
}

export default RoleFormSkeleton;
