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
            <Skeleton className="h-14 rounded-lg" />

            <Divider />

            <div className="grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3">
                {Array.from({ length: 4 }, (_, index) => (
                    <Card className="h-full" key={index}>
                        <CardBody className="p-3">
                            <Skeleton className="aspect-video rounded-lg" />
                        </CardBody>

                        <CardFooter className="flex flex-col items-start gap-4 px-4">
                            <div className="flex w-full flex-col gap-2">
                                <Skeleton className="h-6 w-full rounded-lg" />
                                <Skeleton className="h-6 w-2/5 rounded-lg" />
                            </div>

                            <Skeleton className="h-4 w-1/3 rounded-lg" />

                            <Divider />

                            <div className="grid w-full grid-flow-col justify-items-stretch">
                                {Array.from({ length: 3 }, (_, index) => (
                                    <div
                                        className="flex items-center justify-center"
                                        key={index}
                                    >
                                        <Skeleton className="h-8 w-11 rounded-lg" />
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
