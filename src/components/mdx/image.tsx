import fs from "fs";
import path from "path";
import { Image, ImageProps } from "@nextui-org/react";
import NextImage from "next/image";

type MdxRemoteImageProps = {
    type: "external";
    url: string;
};

type MdxLocalImageProps = {
    type: "local";
    location: string;
};

type MdxImageProps = (MdxRemoteImageProps | MdxLocalImageProps) & ImageProps;

function MdxImage(props: MdxImageProps) {
    if (props.type === "external")
        return (
            <Image
                src={props.url}
                alt={props.url}
                height={1920}
                width={1080}
                {...props}
            />
        );
    else {
        const location = props.location;
        const imagePath = path.join("public", location);
        const image =
            fs.readFileSync(imagePath) ||
            fs.readFileSync(path.join("public", "404.png"));

        const imageBuffer = Buffer.from(image);
        const imageBase64 = imageBuffer.toString("base64");

        const imageSrc = `data:image/png;base64,${imageBase64}`;

        return (
            <Image
                as={NextImage}
                src={imageSrc}
                alt={location}
                height={1920}
                width={1080}
                {...props}
            />
        );
    }
}

export default MdxImage;
