"use client";

import { ProgrammingVideo } from "@/config/video";
import { cn } from "@/lib/utils";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
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
        <motion.div
            className={cn("", className)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <motion.div
                className="overflow-hidden rounded-xl"
                ref={emblaMainRef}
                whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
            >
                <div className="embla__container flex">
                    {videos.map((video) => (
                        <motion.div
                            key={video.id}
                            className="embla__slide min-w-0 p-1"
                        >
                            <div className="relative overflow-hidden rounded-xl drop-shadow-md">
                                <LiteYouTubeEmbed
                                    id={video.id}
                                    title={video.name}
                                />
                                <motion.div
                                    className="absolute bottom-0 left-0 w-full bg-white/30 p-5 text-background"
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <p className="drop-shadow">{video.name}</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div
                className="embla-thumbs relative mt-4 px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <div className="absolute top-1/2 left-0 z-10 h-full w-10 -translate-y-1/2 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute top-1/2 right-0 z-10 h-full w-10 -translate-y-1/2 bg-gradient-to-l from-background to-transparent" />

                <div className="overflow-hidden" ref={emblaThumbsRef}>
                    <div className="flex">
                        {videos.map((video, i) => (
                            <div
                                key={video.id}
                                className="embla-thumbs__slide aspect-video min-w-0 p-1"
                            >
                                <motion.button
                                    onClick={() => onThumbClick(i)}
                                    type="button"
                                    className={cn(
                                        "size-full overflow-hidden rounded-lg",
                                        i === selectedIndex &&
                                            "outline-foreground outline-double"
                                    )}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    animate={{
                                        opacity: i === selectedIndex ? 1 : 0.7,
                                        scale: i === selectedIndex ? 1 : 0.95,
                                    }}
                                >
                                    <Image
                                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                                        alt={video.name}
                                        width={1280}
                                        height={720}
                                        className="size-full object-cover"
                                    />
                                </motion.button>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
