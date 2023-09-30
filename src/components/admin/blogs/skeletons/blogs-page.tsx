"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Card, CardBody, CardFooter, Skeleton } from "@nextui-org/react";

function BlogsPageSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3",
                className
            )}
            {...props}
        >
            {Array.from({ length: 4 }, (_, index) => (
                <Card radius="sm" className="h-full" key={index}>
                    <CardBody className="p-3">
                        <Skeleton className="aspect-video rounded-md" />
                    </CardBody>

                    <CardFooter className="flex flex-col items-start gap-4 px-4">
                        <div className="flex w-full items-center justify-between gap-5">
                            <div className="flex w-full flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-6 w-full rounded-md" />
                                    <Skeleton className="h-6 w-2/5 rounded-md" />
                                </div>
                                <Skeleton className="h-4 w-1/3 rounded-md" />
                            </div>

                            <div>
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

export default BlogsPageSkeleton;
