"use client";

import { motion } from "motion/react";

const decorativeShapes = [
    {
        className: "top-[15%] left-[10%] size-2.5 rounded-full bg-primary/20",
        drift: { y: [0, -10, 0], x: [0, 4, 0] },
        dur: 11,
    },
    {
        className:
            "top-[25%] right-[12%] size-3 rotate-45 rounded-sm bg-secondary/15",
        drift: { y: [0, 8, 0], rotate: [45, 90, 45] },
        dur: 14,
    },
    {
        className:
            "bottom-[20%] left-[18%] size-2 rounded-full border border-accent/25",
        drift: { y: [0, 12, 0] },
        dur: 12,
    },
    {
        className:
            "bottom-[30%] right-[15%] size-3.5 rounded-full bg-primary/10",
        drift: { y: [0, -8, 0], x: [0, -5, 0] },
        dur: 16,
    },
];

export function BlogTitle() {
    return (
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

            {/* Subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)/0.04,transparent_70%)]" />

            <motion.div
                className="relative flex flex-col items-center gap-4 text-center"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.span
                    className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium tracking-widest text-primary uppercase"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    Thoughts & Learnings
                </motion.span>

                <motion.h1
                    className="text-gradient font-[family-name:var(--font-syne)] text-5xl font-extrabold tracking-tight md:text-7xl"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    Blogs
                </motion.h1>

                <motion.p
                    className="max-w-lg text-base text-muted-foreground md:text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                >
                    Exploring the latest in web tech, programming patterns, and
                    developer workflows.
                </motion.p>
            </motion.div>
        </div>
    );
}
