"use client";

import { ProgrammingVideo } from "@/config/video";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface VideoCardProps extends GenericProps {
    videos: ProgrammingVideo[];
}

export function VideoCards({ className, videos, ...props }: VideoCardProps) {
    return (
        <div className={cn("flex flex-col gap-4", className)} {...props}>
            {videos.map((video) => (
                <div
                    key={video.id}
                    className="overflow-hidden rounded-xl bg-card drop-shadow-sm"
                >
                    <LiteYouTubeEmbed id={video.id} title={video.name} />
                    <h2 className="p-3 font-bold">{video.name}</h2>
                </div>
            ))}
        </div>
    );
}
