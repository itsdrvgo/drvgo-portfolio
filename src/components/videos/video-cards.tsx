"use client";

import { ProgrammingVideo } from "@/config/video";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface VideoCardProps extends GenericProps {
    videos: ProgrammingVideo[];
}

export function VideoCards({ className, videos, ...props }: VideoCardProps) {
    return (
        <div className={cn("flex flex-col gap-4", className)} {...props}>
            {videos.map((video, index) => (
                <motion.div
                    key={video.id}
                    className="overflow-hidden rounded-xl bg-card drop-shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.2 + index * 0.1,
                        ease: "easeOut",
                    }}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        transition: { duration: 0.2 },
                    }}
                >
                    <LiteYouTubeEmbed id={video.id} title={video.name} />
                    <motion.h2
                        className="p-3 font-bold"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                    >
                        {video.name}
                    </motion.h2>
                </motion.div>
            ))}
        </div>
    );
}
