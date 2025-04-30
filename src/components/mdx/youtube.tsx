"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface Props {
    id: string;
    title?: string;
}

export function YouTube({ id, title = "YouTube Video Player" }: Props) {
    return (
        <div className="overflow-hidden rounded-md">
            <LiteYouTubeEmbed id={id} title={title} />
        </div>
    );
}
