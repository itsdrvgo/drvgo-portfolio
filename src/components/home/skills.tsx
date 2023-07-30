"use client";

import { DefaultProps } from "@/src/types";
import { motion, Variants } from "framer-motion";
import { Icons } from "../icons/icons";

function Skills({ className }: DefaultProps) {
    const fadeInContainer: Variants = {
        hide: {
            opacity: 0,
            y: 100,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.5,
                duration: 0.5,
            },
        },
    };

    return (
        <motion.section
            className={className}
            variants={fadeInContainer}
            initial="hide"
            whileInView={"show"}
            viewport={{ once: true }}
        >
            <motion.div
                className="container flex max-w-[75rem] flex-col items-center justify-center gap-10 p-0 md:gap-20"
                variants={fadeInContainer}
            >
                <div className="flex flex-col items-center gap-5 text-center">
                    <p className="text-4xl font-bold md:text-5xl">My Skills</p>
                    <p className="text-sm text-gray-400 md:text-base">
                        I always try my best to keep myself updated with the
                        latest technologies out there.
                    </p>
                </div>

                <div className="grid grid-cols-1 divide-x-0 divide-y overflow-hidden rounded-md border border-gray-600 md:grid-cols-3 md:divide-x md:divide-y-0">
                    <motion.div
                        className="flex flex-col items-center gap-10 p-10 py-20 text-center"
                        variants={fadeInContainer}
                    >
                        <div className="flex flex-col items-center justify-center gap-5">
                            <div className="rounded-full bg-secondary p-4">
                                <Icons.layers className="h-8 w-8" />
                            </div>
                            <p className="text-xl font-semibold">Designer</p>
                            <p className="text-sm text-gray-300">
                                I value simplicity, clean designs, and unique
                                interactions
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-lg font-medium text-accent-foreground">
                                Things I know:
                            </p>
                            <p className="text-sm text-gray-400">
                                3D Modeling, Animation, Logos, Web, UI, UX
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-lg font-medium text-accent-foreground">
                                Tools:
                            </p>
                            <ul className="list-none text-sm text-gray-400">
                                <li>Adobe Premiere Pro</li>
                                <li>Adobe Photoshop</li>
                                <li>Adobe After Effects</li>
                                <li>Adobe Illustrator</li>
                                <li>Figma</li>
                                <li>Blender</li>
                                <li>DaVinci Resolve</li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center gap-10 p-10 py-20 text-center"
                        variants={fadeInContainer}
                    >
                        <div className="flex flex-col items-center justify-center gap-5">
                            <div className="rounded-full bg-secondary p-4">
                                <Icons.code className="h-8 w-8" />
                            </div>
                            <p className="text-xl font-semibold">
                                Full-stack Developer
                            </p>
                            <p className="text-sm text-gray-300">
                                I love coding from the scratch, and bringing new
                                ideas to life.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-lg font-medium text-accent-foreground">
                                Frameworks & Libraries:
                            </p>
                            <p className="text-sm text-gray-400">
                                React, Next.JS, ShadCN UI, Tailwind CSS, Sass
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-lg font-medium text-accent-foreground">
                                Languages:
                            </p>
                            <p className="text-sm text-gray-400">
                                HTML, CSS, JavaScript, TypeScript, Node.JS
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-lg font-medium text-accent-foreground">
                                Back-End & Database:
                            </p>
                            <p className="text-sm text-gray-400">
                                MySQL, MongoDB, Planetscale, Drizzle ORM,
                                Next-Auth, Clerk, Zod, Vercel
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center gap-10 p-10 py-20 text-center"
                        variants={fadeInContainer}
                    >
                        <div className="flex flex-col items-center justify-center gap-5">
                            <div className="rounded-full bg-secondary p-4">
                                <Icons.music className="h-8 w-8" />
                            </div>
                            <p className="text-xl font-semibold">Musician</p>
                            <p className="text-sm text-gray-300">
                                Since my childhood, I always had an affection to
                                Music.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-lg font-medium text-accent-foreground">
                                Genres I like:
                            </p>
                            <p className="text-sm text-gray-400">
                                Pop, J-Rock, Country, RnB, Soul, Lo-Fi, EDM,
                                Jazz, Blues
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-lg font-medium text-accent-foreground">
                                Experiences:
                            </p>
                            <ul className="list-none text-sm text-gray-400">
                                <li>10+ Original Compositions</li>
                                <li>50+ Raw Tracks</li>
                                <li>100+ Songs</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.section>
    );
}

export default Skills;
