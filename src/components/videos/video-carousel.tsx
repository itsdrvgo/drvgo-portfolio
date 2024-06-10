"use client";

import { ProgrammingVideo } from "@/config/video";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface VideoCarouselProps extends GenericProps {
    videos: ProgrammingVideo[];
    options?: EmblaOptionsType;
}

export function VideoCarousel({
    className,
    videos,
    options,
    ...props
}: VideoCarouselProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
    });

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaMainApi) return;
        onSelect();

        emblaMainApi.on("select", onSelect).on("reInit", onSelect);
    }, [emblaMainApi, onSelect]);

    return (
        <div className={cn("", className)} {...props}>
            <div className="overflow-hidden" ref={emblaMainRef}>
                <div className="embla__container flex">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className="embla__slide min-w-0 p-1"
                        >
                            <div className="relative overflow-hidden rounded-xl drop-shadow-md">
                                <LiteYouTubeEmbed
                                    id={video.id}
                                    title={video.name}
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-white/30 p-5 text-background">
                                    <p className="drop-shadow">{video.name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla-thumbs relative px-1">
                <div className="absolute left-0 top-1/2 z-10 h-full w-10 -translate-y-1/2 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-1/2 z-10 h-full w-10 -translate-y-1/2 bg-gradient-to-l from-background to-transparent" />

                <div className="overflow-hidden" ref={emblaThumbsRef}>
                    <div className="flex">
                        {videos.map((video, i) => (
                            <div
                                key={video.id}
                                className="embla-thumbs__slide aspect-video min-w-0 p-1"
                            >
                                <button
                                    onClick={() => onThumbClick(i)}
                                    type="button"
                                    className={cn(
                                        "size-full overflow-hidden rounded-lg",
                                        i === selectedIndex &&
                                            "outline-double outline-foreground"
                                    )}
                                >
                                    <Image
                                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                                        alt={video.name}
                                        width={1280}
                                        height={720}
                                        className="size-full object-cover"
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
