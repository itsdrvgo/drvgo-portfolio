"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icons } from "../../icons/icons";

interface PageProps extends DefaultProps {
    data: ExtendedBlog[];
}

function BlogNavItems({ className, data }: PageProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between">
            <Button
                radius="sm"
                variant="flat"
                className="border border-gray-700"
                onPress={() => router.push("/blogs")}
                startContent={<Icons.chevronLeft className="h-5 w-5" />}
            >
                Go Back
            </Button>

            <Popover
                placement="bottom"
                radius="sm"
                classNames={{
                    base: "w-72 max-h-96",
                }}
            >
                <PopoverTrigger>
                    <Button
                        radius="sm"
                        variant="flat"
                        className="border border-gray-700"
                        startContent={<Icons.dashboard className="h-5 w-5" />}
                    >
                        More Blogs
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="gap-2 pb-4 pt-2">
                    <h2
                        className={cn(
                            "p-2 font-semibold uppercase",
                            "text-center"
                        )}
                    >
                        People Also Like
                    </h2>

                    <Divider />

                    <div
                        className={cn(
                            "flex flex-col gap-2 overflow-y-scroll",
                            className
                        )}
                    >
                        {data.length ? (
                            data
                                .sort((a, b) => b.likes.length - a.likes.length)
                                .map((blog) => (
                                    <Card
                                        key={blog.id}
                                        isPressable
                                        onPress={() =>
                                            router.push(`/blogs/${blog.id}`)
                                        }
                                        classNames={{
                                            base: "bg-transparent shadow-none gap-0",
                                            header: "p-2",
                                            body: "p-2",
                                            footer: "p-2",
                                        }}
                                    >
                                        <CardHeader className="text-left text-sm">
                                            {blog.title}
                                        </CardHeader>

                                        <CardBody className="text-xs text-gray-400">
                                            {blog.description}
                                        </CardBody>

                                        <CardFooter className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Icons.thumbsup className="h-4 w-4" />
                                                <p>{blog.likes.length}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Icons.comment className="h-4 w-4" />
                                                <p>{blog.comments.length}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Icons.view className="h-4 w-4" />
                                                <p>{blog.views.length}</p>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))
                        ) : (
                            <p className="p-1 text-sm text-gray-400">
                                No blogs found
                            </p>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default BlogNavItems;
