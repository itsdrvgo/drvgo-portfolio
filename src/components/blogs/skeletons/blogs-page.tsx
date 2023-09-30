"use client";

import {
    Card,
    CardBody,
    CardFooter,
    Divider,
    Skeleton,
} from "@nextui-org/react";

function BlogsPageSkeleton() {
    return (
        <div className="flex flex-col gap-5">
            <Skeleton className="h-14 rounded-md" />

            <Divider />

            <div className="grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3">
                {Array.from({ length: 4 }, (_, index) => (
                    <Card radius="sm" className="h-full" key={index}>
                        <CardBody className="p-3">
                            <Skeleton className="aspect-video rounded-md" />
                        </CardBody>

                        <CardFooter className="flex flex-col items-start gap-4 px-4">
                            <div className="flex w-full flex-col gap-2">
                                <Skeleton className="h-6 w-full rounded-md" />
                                <Skeleton className="h-6 w-2/5 rounded-md" />
                            </div>

                            <Skeleton className="h-4 w-1/3 rounded-md" />

                            <Divider />

                            <div className="grid w-full grid-flow-col justify-items-stretch">
                                {Array.from({ length: 3 }, (_, index) => (
                                    <div
                                        className="flex items-center justify-center"
                                        key={index}
                                    >
                                        <Skeleton className="h-8 w-11 rounded-md" />
                                    </div>
                                ))}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default BlogsPageSkeleton;
