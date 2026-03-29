import { skills } from "@/config/tech-stack";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function TechStack({ className, ...props }: GenericProps) {
    const [activeSkill, setActiveSkill] = useState<number | null>(null);

    return (
        <section
            className={cn(
                "relative overflow-hidden px-5 py-28 md:py-36",
                className
            )}
            {...props}
        >
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
                {/* Header */}
                <motion.div
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-sm font-medium tracking-widest text-primary uppercase">
                        What I Use
                    </p>
                    <h2 className="text-gradient text-4xl font-bold md:text-6xl">
                        Tech Stack
                    </h2>
                </motion.div>

                {/* Skills Grid - Hexagonal-inspired minimal cards */}
                <motion.div
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                >
                    {skills.map((skill, i) => (
                        <motion.div
                            key={skill.name}
                            className={cn(
                                "group relative flex flex-col items-center gap-3 rounded-2xl border bg-card/50 p-6 backdrop-blur-sm transition-colors",
                                activeSkill === i &&
                                    "border-primary/40 bg-primary/5"
                            )}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 14,
                                delay: 0.04 * i,
                            }}
                            whileHover={{
                                y: -8,
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15,
                                },
                            }}
                            onHoverStart={() => setActiveSkill(i)}
                            onHoverEnd={() => setActiveSkill(null)}
                        >
                            <motion.div
                                className="relative flex size-14 items-center justify-center"
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                }}
                            >
                                <Image
                                    src={skill.icon}
                                    alt={skill.name}
                                    width={48}
                                    height={48}
                                    className="size-10 drop-shadow-sm"
                                />
                            </motion.div>

                            <p className="text-center text-sm font-medium">
                                {skill.name}
                            </p>

                            {/* Hover tooltip with description */}
                            <motion.div
                                className="absolute -top-2 left-1/2 z-20 w-48 -translate-x-1/2 -translate-y-full rounded-xl border bg-card p-3 shadow-lg"
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{
                                    opacity: activeSkill === i ? 1 : 0,
                                    y: activeSkill === i ? 0 : 8,
                                    scale: activeSkill === i ? 1 : 0.95,
                                    pointerEvents:
                                        activeSkill === i
                                            ? ("auto" as const)
                                            : ("none" as const),
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <p className="text-xs text-muted-foreground">
                                    {skill.description}
                                </p>
                                <Link
                                    href={skill.href}
                                    target="_blank"
                                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                >
                                    Docs &rarr;
                                </Link>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Infinite Marquee - tech names scrolling */}
                <motion.div
                    className="relative overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <div className="absolute top-0 left-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
                    <div className="absolute top-0 right-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

                    <div className="flex animate-marquee gap-8 whitespace-nowrap">
                        {[...skills, ...skills].map((skill, i) => (
                            <span
                                key={`${skill.name}-${i}`}
                                className="text-2xl font-bold text-muted-foreground/20 uppercase md:text-4xl"
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
