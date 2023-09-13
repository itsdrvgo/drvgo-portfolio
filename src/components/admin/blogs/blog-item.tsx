"use client";

import { defaultBlogThumbnail } from "@/src/config/const";
import { formatDate } from "@/src/lib/utils";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import NextImage from "next/image";
import Link from "next/link";
import BlogOperations from "./blog-item-operations";

interface PageProps extends DefaultProps {
    blog: ExtendedBlog;
}

function BlogItem({ blog, className }: PageProps) {
    return (
        <Card radius="sm" isPressable className="h-full">
            <CardBody className="p-3">
                <Image
                    as={NextImage}
                    radius="sm"
                    src={blog.thumbnailUrl ?? defaultBlogThumbnail.src}
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
                        href={`/admin/blogs/${blog.id}`}
                        className="font-semibold hover:underline"
                    >
                        {blog.title}
                    </Link>

                    <p className="text-sm text-gray-400">
                        {formatDate(blog.createdAt.getTime())}
                    </p>
                </div>

                <BlogOperations blog={blog} />
            </CardFooter>
        </Card>
    );
}

export default BlogItem;
