"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

export function YouTube({ id }: { id: string }) {
    return (
        <div className="overflow-hidden rounded-md">
            <LiteYouTubeEmbed id={id} title="YouTube video player" />
        </div>
    );
}
