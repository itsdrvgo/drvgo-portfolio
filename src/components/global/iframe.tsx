"use client";

import { cn } from "@/src/lib/utils";
import { IframeHTMLAttributes } from "react";

function IFrame({
    src,
    width,
    height,
    title,
    className,
}: IframeHTMLAttributes<HTMLIFrameElement>) {
    return (
        <iframe
            width={width}
            height={height}
            src={src}
            title={title || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className={cn("aspect-video rounded-md", className)}
            allowFullScreen
        />
    );
}

export default IFrame;
