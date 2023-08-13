"use client";

import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/icons";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

interface PageProps extends DefaultProps {
    data: ExtendedBlog[];
}

function BlogNavItems({ className, data }: PageProps) {
    const router = useRouter();

    const handleRedirect = (blogId: number) => {
        router.push(`/blogs/${blogId}`);

        axios
            .patch<ResponseData>(`/api/blogs/views/${blogId}`)
            .then(({ data: resData }) => {
                if (resData.code !== 200) return console.log(resData.message);
                console.log("Updated view");
            })
            .catch((err) => {
                console.log(err);
                console.log("Couldn't update view");
            });
    };

    return (
        <div className="flex items-center justify-between">
            <Button
                className="flex items-center gap-1 border border-gray-700 bg-background"
                variant={"secondary"}
                onClick={() => router.push("/blogs")}
            >
                <Icons.chevronLeft className="h-5 w-5" />
                <p>Go Back</p>
            </Button>

            <Popover>
                <PopoverTrigger className="flex items-center gap-2 rounded-md border border-gray-700 p-2 px-4">
                    <Icons.dashboard className="h-5 w-5" />
                    <p className="text-sm">More Blogs</p>
                </PopoverTrigger>

                <PopoverContent className="ml-2">
                    <h2 className="p-2 font-medium uppercase">
                        People Also Like
                    </h2>

                    <Separator className="mb-2" />

                    <div
                        className={cn(
                            "flex max-h-96 flex-col gap-2 overflow-y-scroll",
                            className
                        )}
                    >
                        {data.length ? (
                            data
                                .sort((a, b) => b.likes.length - a.likes.length)
                                .map((blog) => (
                                    <div
                                        key={blog.id}
                                        className="cursor-pointer space-y-2 rounded-md p-4 transition-all ease-in-out hover:bg-gray-800"
                                        onClick={() => handleRedirect(blog.id)}
                                    >
                                        <p className="text-sm">{blog.title}</p>
                                        <p className="text-xs text-gray-400">
                                            {blog.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
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
                                        </div>
                                    </div>
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
