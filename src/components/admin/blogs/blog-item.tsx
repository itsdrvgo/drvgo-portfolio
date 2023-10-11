"use client";

import { DEFAULT_BLOG_THUMBNAIL } from "@/src/config/const";
import { formatDate } from "@/src/lib/utils";
import { CachedBlog } from "@/src/types/cache";
import { Card, CardBody, CardFooter, Image, Link } from "@nextui-org/react";
import NextImage from "next/image";
import NextLink from "next/link";
import BlogOperations from "./blog-item-operations";

interface PageProps {
    blog: CachedBlog;
}

function BlogItem({ blog }: PageProps) {
    return (
        <Card radius="sm" isPressable className="h-full">
            <CardBody className="p-3">
                <Image
                    as={NextImage}
                    radius="sm"
                    src={blog.thumbnailUrl ?? DEFAULT_BLOG_THUMBNAIL.src}
                    isZoomed
                    alt={blog.id.toString()}
                    width={500}
                    height={500}
                    className="aspect-video object-cover"
                />
            </CardBody>

            <CardFooter className="flex items-center justify-between gap-2 px-4 text-left">
                <div className="space-y-2">
                    <Link
                        as={NextLink}
                        href={`/admin/blogs/${blog.id}`}
                        underline="hover"
                        color="foreground"
                        className="font-semibold"
                    >
                        {blog.title}
                    </Link>

                    <p className="text-sm text-gray-400">
                        {formatDate(blog.createdAt)}
                    </p>
                </div>

                <BlogOperations blog={blog} />
            </CardFooter>
        </Card>
    );
}

export default BlogItem;
