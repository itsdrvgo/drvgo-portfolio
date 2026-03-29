"use client";

import { ProgrammingVideo } from "@/config/video";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import Image from "next/image";

interface VideoCardProps extends GenericProps {
    videos: ProgrammingVideo[];
}

export function VideoCards({ className, videos, ...props }: VideoCardProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeVideo = videos[activeIndex];

    return (
        <div className={cn("space-y-6", className)} {...props}>
            {/* Active player */}
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
                    className="text-center text-base font-semibold tracking-tight"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeVideo.name}
                </motion.h3>
            </AnimatePresence>

            {/* Video list */}
            <div className="flex flex-col gap-2">
                {videos.map((video, index) => (
                    <motion.button
                        key={video.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                            "flex items-center gap-3 rounded-xl border p-2 text-left transition-all",
                            index === activeIndex
                                ? "border-primary/40 bg-primary/5"
                                : "border-transparent hover:bg-muted/60"
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 18,
                            delay: 0.03 * index,
                        }}
                    >
                        <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg">
                            <Image
                                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                alt={video.name}
                                width={320}
                                height={180}
                                className="size-full object-cover"
                            />
                            {index === activeIndex && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground">
                                        Playing
                                    </span>
                                </div>
                            )}
                        </div>
                        <p
                            className={cn(
                                "line-clamp-2 text-sm leading-snug font-medium",
                                index === activeIndex
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {video.name}
                        </p>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
