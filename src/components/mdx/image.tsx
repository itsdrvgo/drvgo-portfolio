import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
    height?: number;
    width?: number;
    className?: string;
    url: string;
    alt?: string;
};

export function MdxImage({
    url,
    alt = "Image",
    height = 1920,
    width = 1080,
    className,
    ...props
}: Props) {
    return (
        <div className="aspect-video overflow-hidden">
            <Image
                src={url}
                alt={alt}
                height={height}
                width={width}
                className={cn("size-full object-cover", className)}
                {...props}
            />
        </div>
    );
}
