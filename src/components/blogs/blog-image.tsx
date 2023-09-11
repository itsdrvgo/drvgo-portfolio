"use client";

import { DefaultProps, ExtendedBlog } from "@/src/types";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";

interface PageProps extends DefaultProps {
    blog: ExtendedBlog;
}

function BlogImage({ blog }: PageProps) {
    return (
        <Image
            as={NextImage}
            radius="sm"
            src={blog.thumbnailUrl!}
            alt="thumbnail"
            width={1920}
            height={1080}
        />
    );
}

export default BlogImage;
