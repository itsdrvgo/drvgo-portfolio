"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Divider, Skeleton } from "@nextui-org/react";

function ProjectViewSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div
            className={cn("flex w-full flex-col items-center gap-5", className)}
            {...props}
        >
            <div className="flex w-full flex-col gap-4">
                <Skeleton className="h-14 w-full rounded-md" />

                <Divider />

                <div className="flex items-center gap-2">
                    <Skeleton className="h-11 w-11 rounded-full" />

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-28 rounded-md" />
                            <Skeleton className="h-6 w-12 rounded-full" />
                        </div>

                        <Skeleton className="h-5 w-52 rounded-md" />
                    </div>
                </div>

                <div className="grid grid-flow-row gap-4 md:grid-flow-col">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton className="h-20 w-full rounded-md" key={i} />
                    ))}
                </div>

                <Divider />

                <Skeleton className="h-16 w-full rounded-md" />
                <Skeleton className="h-96 w-full rounded-md" />
            </div>

            <div className="flex items-center justify-center">
                <Skeleton className="h-10 w-40 rounded-md" />
            </div>
        </div>
    );
}

export default ProjectViewSkeleton;
