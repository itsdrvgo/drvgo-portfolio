"use client";

import { projects } from "@/config/projects";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icons } from "../icons";

export function Showcase({ className }: GenericProps) {
    return (
        <section
            className={cn(
                "relative overflow-hidden px-5 py-28 md:py-36",
                className
            )}
        >
            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

            <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12">
                {/* Header */}
                <motion.div
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-sm font-medium tracking-widest text-primary uppercase">
                        Selected Work
                    </p>
                    <h2 className="text-gradient text-4xl font-bold md:text-6xl">
                        Showcase
                    </h2>
                </motion.div>

                {/* Grid — 2 rows, uniform height per row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {projects.map((project, i) => (
                        <ProjectCard
                            project={project}
                            index={i}
                            key={project.name}
                            isWide={i === 0 || i === 3}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProjectCard({
    project,
    index,
    isWide,
}: {
    project: (typeof projects)[number];
    index: number;
    isWide: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={cn(
                "group relative h-64 overflow-hidden rounded-2xl border bg-card",
                isWide ? "md:col-span-2" : "md:col-span-1"
            )}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.08 * index,
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Image */}
            <motion.div
                className="absolute inset-0"
                animate={{ scale: isHovered ? 1.06 : 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Image
                    src={project.thumbnail}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                />
            </motion.div>

            {/* Gradient overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                animate={{ opacity: isHovered ? 1 : 0.6 }}
                transition={{ duration: 0.3 }}
            />

            {/* Content */}
            <div className="relative flex size-full flex-col justify-end gap-2 p-5 text-white">
                <AnimatePresence>
                    {isHovered && (
                        <motion.p
                            className="text-sm text-white/70"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.25 }}
                        >
                            {project.description}
                        </motion.p>
                    )}
                </AnimatePresence>

                <div className="flex items-end justify-between">
                    <h4 className="text-lg font-semibold md:text-xl">
                        {project.name}
                    </h4>

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            x: isHovered ? 0 : -10,
                        }}
                        transition={{ duration: 0.25 }}
                    >
                        <Link
                            href={project.demo ?? project.source}
                            target="_blank"
                            className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                        >
                            {project.demo ? "Live" : "Source"}
                            <Icons.ChevronRight className="size-3" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
