"use client";

import { Image, ImageProps } from "@nextui-org/react";
import NextImage from "next/image";
import { ImgHTMLAttributes } from "react";

function MdImage({
    ...props
}: ImageProps & ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <Image
            as={NextImage}
            radius="sm"
            alt="image"
            width={1920}
            height={1080}
            {...props}
        />
    );
}

export default MdImage;
