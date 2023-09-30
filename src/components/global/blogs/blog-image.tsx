"use client";

import { Image, ImageProps } from "@nextui-org/react";
import NextImage from "next/image";

function BlogImage({ src, ...props }: ImageProps) {
    return (
        <Image
            as={NextImage}
            radius="sm"
            src={src}
            alt="thumbnail"
            width={1920}
            height={1080}
            {...props}
        />
    );
}

export default BlogImage;
