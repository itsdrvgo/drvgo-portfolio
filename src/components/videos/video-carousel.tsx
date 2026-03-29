"use client";

import { ProgrammingVideo } from "@/config/video";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface VideoCarouselProps extends GenericProps {
    videos: ProgrammingVideo[];
}

export function VideoCarousel({ className, videos }: VideoCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeVideo = videos[activeIndex];

    return (
        <div className={cn("space-y-8", className)}>
            {/* Featured player */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="overflow-hidden rounded-2xl border shadow-lg shadow-primary/5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeVideo.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <LiteYouTubeEmbed
                                id={activeVideo.id}
                                title={activeVideo.name}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                    <motion.h3
                        key={activeIndex}
                        className="mt-4 text-center text-lg font-semibold tracking-tight"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeVideo.name}
                    </motion.h3>
                </AnimatePresence>
            </motion.div>

            {/* Thumbnail grid */}
            <motion.div
                className="grid grid-cols-2 gap-3 lg:grid-cols-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
            >
                {videos.map((video, i) => (
                    <motion.button
                        key={video.id}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        className={cn(
                            "group relative overflow-hidden rounded-xl border-2 text-left transition-all duration-200",
                            i === activeIndex
                                ? "border-primary shadow-md shadow-primary/10"
                                : "border-transparent hover:border-border"
                        )}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 18,
                            delay: 0.04 * i,
                        }}
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden">
                            <Image
                                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                alt={video.name}
                                width={320}
                                height={180}
                                className={cn(
                                    "size-full object-cover transition-all duration-300",
                                    i === activeIndex
                                        ? "brightness-100"
                                        : "brightness-90 group-hover:brightness-100"
                                )}
                            />

                            {/* Dark gradient at bottom for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Play icon overlay (not active) */}
                            {i !== activeIndex && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="flex size-8 items-center justify-center rounded-full bg-white/90 shadow-md">
                                        <svg
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                            className="ml-0.5 size-3.5 text-foreground"
                                        >
                                            <path d="M4 2l10 6-10 6V2z" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {/* Now playing indicator */}
                            {i === activeIndex && (
                                <div className="absolute top-2 left-2">
                                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                        Playing
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div className="bg-card/80 px-3 py-2.5">
                            <p
                                className={cn(
                                    "line-clamp-2 text-xs leading-snug font-medium transition-colors",
                                    i === activeIndex
                                        ? "text-primary"
                                        : "text-muted-foreground group-hover:text-foreground"
                                )}
                            >
                                {video.name}
                            </p>
                        </div>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
}
