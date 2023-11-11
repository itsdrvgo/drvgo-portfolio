"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { CachedBlog } from "@/src/types/cache";
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
    data: CachedBlog[];
}

function BlogNavItems({ className, data }: PageProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between rounded-full bg-primary-50 p-1 px-3">
            <Button
                radius="full"
                variant="light"
                color="primary"
                onPress={() => router.push("/blogs")}
                startContent={<Icons.chevronLeft className="h-5 w-5" />}
                isIconOnly
            />

            <Popover
                placement="bottom"
                classNames={{
                    base: "w-72 max-h-96 rounded-r-none",
                }}
                showArrow={false}
            >
                <PopoverTrigger>
                    <Button
                        radius="full"
                        variant="light"
                        color="primary"
                        startContent={<Icons.moreVert className="h-5 w-5" />}
                        isIconOnly
                    />
                </PopoverTrigger>
                <PopoverContent
                    className={cn("justify-start gap-2 pb-4 pt-2", {
                        "overflow-y-scroll": data.length,
                    })}
                >
                    <h2
                        className={cn(
                            "p-2 font-semibold uppercase",
                            "text-center"
                        )}
                    >
                        People Also Like
                    </h2>

                    <Divider />

                    <div className={cn("flex flex-col gap-2", className)}>
                        {data.length ? (
                            data
                                .sort((a, b) => b.likes - a.likes)
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
                                                <p>{blog.likes}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Icons.comment className="h-4 w-4" />
                                                <p>{blog.comments}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Icons.view className="h-4 w-4" />
                                                <p>{blog.views}</p>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))
                        ) : (
                            <p className="text-sm text-gray-400">
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
