"use client";

import { DefaultProps } from "@/src/types";
import { Icons } from "../icons/icons";
import { Variants, motion } from "framer-motion";

function Skills({ className }: DefaultProps) {
    const fadeInContainer: Variants = {
        hide: {
            opacity: 0,
            y: 100
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.5,
                duration: 0.5
            }
        }
    }

    return (
        <motion.section
            className={className}
            variants={fadeInContainer}
            initial="hide"
            whileInView={"show"}
            viewport={{ once: true }}
        >
            <motion.div
                className="container flex flex-col gap-10 md:gap-20 justify-center items-center max-w-[75rem] p-0"
                variants={fadeInContainer}
            >
                <div className="flex flex-col items-center text-center gap-5">
                    <p className="text-4xl md:text-5xl font-bold">My Skills</p>
                    <p className="text-gray-400 text-sm md:text-base">I always try my best to keep myself updated with the latest technologies out there.</p>
                </div>

                <div className="border border-gray-600 rounded-md grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 divide-x-0 md:divide-x overflow-hidden">
                    <motion.div
                        className="flex flex-col items-center p-10 py-20 gap-10 text-center"
                        variants={fadeInContainer}
                    >
                        <div className="flex flex-col gap-5 justify-center items-center">
                            <div className="p-4 rounded-full bg-primary">
                                <Icons.layers className="h-8 w-8" />
                            </div>
                            <p className="font-semibold text-xl">Designer</p>
                            <p className="text-sm text-gray-300">I value simplicity, clean designs, and unique interactions</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-accent text-lg font-medium">Things I know:</p>
                            <p className="text-sm text-gray-400">3D Modeling, Animation, Logos, Web, UI, UX</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-accent text-lg font-medium">Tools:</p>
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
                        className="flex flex-col items-center p-10 py-20 gap-10 text-center"
                        variants={fadeInContainer}
                    >
                        <div className="flex flex-col gap-5 justify-center items-center">
                            <div className="p-4 rounded-full bg-primary">
                                <Icons.code className="h-8 w-8" />
                            </div>
                            <p className="font-semibold text-xl">Full-stack  Developer</p>
                            <p className="text-sm text-gray-300">I love coding from the scratch, and bringing new ideas to life.</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-accent text-lg font-medium">Frameworks & Libraries:</p>
                            <p className="text-sm text-gray-400">React, Next.JS, ShadCN UI, Tailwind CSS</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-accent text-lg font-medium">Languages:</p>
                            <p className="text-sm text-gray-400">HTML, CSS, Sass, JavaScript, TypeScript</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-accent text-lg font-medium">Back-End & Database:</p>
                            <p className="text-sm text-gray-400">MySQL, MongoDB, Planetscale, Drizzle ORM, Next-Auth, Clerk, Zod, Vercel</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center p-10 py-20 gap-10 text-center"
                        variants={fadeInContainer}
                    >
                        <div className="flex flex-col gap-5 justify-center items-center">
                            <div className="p-4 rounded-full bg-primary">
                                <Icons.music className="h-8 w-8" />
                            </div>
                            <p className="font-semibold text-xl">Musician</p>
                            <p className="text-sm text-gray-300">Since my childhood, I always had an affection to Music.</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-accent text-lg font-medium">Genres I like:</p>
                            <p className="text-sm text-gray-400">Pop, J-Rock, Country, RnB, Soul, Lo-Fi, EDM, Jazz, Blues</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-accent text-lg font-medium">Experiences:</p>
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