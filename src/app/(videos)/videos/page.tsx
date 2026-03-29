"use client";

import { VideoCards, VideoCarousel } from "@/components/videos";
import { programmingVideos } from "@/config/video";
import { motion } from "motion/react";

const decorativeShapes = [
    {
        className: "top-[18%] left-[8%] size-2 rounded-full bg-secondary/25",
        drift: { y: [0, -12, 0], x: [0, 5, 0] },
        dur: 12,
    },
    {
        className:
            "top-[22%] right-[10%] size-3 rotate-45 rounded-sm bg-primary/15",
        drift: { y: [0, 8, 0], rotate: [45, 90, 45] },
        dur: 15,
    },
    {
        className:
            "bottom-[25%] left-[15%] size-2.5 rounded-full border border-accent/20",
        drift: { y: [0, 10, 0] },
        dur: 13,
    },
    {
        className:
            "bottom-[20%] right-[18%] size-2 rounded-full bg-secondary/20",
        drift: { y: [0, -8, 0], x: [0, -4, 0] },
        dur: 14,
    },
];

function Page() {
    return (
        <section className="min-h-screen">
            {/* Hero header */}
            <div className="relative overflow-hidden px-5 py-16 md:py-24">
                {/* Floating shapes */}
                {decorativeShapes.map((shape, i) => (
                    <motion.div
                        key={i}
                        className={`pointer-events-none absolute ${shape.className}`}
                        animate={shape.drift}
                        transition={{
                            duration: shape.dur,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-secondary)/0.04,transparent_70%)]" />

                <motion.div
                    className="relative flex flex-col items-center gap-4 text-center"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.span
                        className="inline-block rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5 text-xs font-medium tracking-widest text-secondary uppercase"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        Content
                    </motion.span>

                    <motion.h1
                        className="text-gradient font-[family-name:var(--font-syne)] text-5xl font-extrabold tracking-tight md:text-7xl"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        Videos
                    </motion.h1>

                    <motion.p
                        className="max-w-lg text-base text-muted-foreground md:text-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        Tutorials, deep dives, and thoughts on modern web
                        development.
                    </motion.p>
                </motion.div>
            </div>

            {/* Video content */}
            <div className="mx-auto max-w-5xl px-5 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <VideoCards
                        videos={programmingVideos}
                        className="md:hidden"
                    />

                    <VideoCarousel
                        videos={programmingVideos}
                        className="hidden md:block"
                    />
                </motion.div>
            </div>
        </section>
    );
}

export default Page;
