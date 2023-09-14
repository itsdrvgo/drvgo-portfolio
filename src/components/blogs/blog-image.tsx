"use client";

import { DefaultProps, ExtendedBlog } from "@/src/types";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";

interface PageProps extends DefaultProps {
    imageUrl: string;
}

function BlogImage({ imageUrl }: PageProps) {
    return (
        <Image
            as={NextImage}
            radius="sm"
            src={imageUrl}
            alt="thumbnail"
            width={1920}
            height={1080}
        />
    );
}

export default BlogImage;
