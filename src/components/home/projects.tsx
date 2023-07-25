"use client";

import { projectsConfig } from "@/src/config/projects";
import { siteConfig } from "@/src/config/site";
import { DefaultProps } from "@/src/types";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

function Projects({ className }: DefaultProps) {
    const fadeInContainer: Variants = {
        hide: {
            opacity: 0,
            y: 100,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2,
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
                className="container mt-20 flex max-w-[75rem] flex-col items-center justify-center gap-20 p-0 md:mt-0"
                variants={fadeInContainer}
            >
                <div className="flex flex-col items-center gap-5 text-center">
                    <p className="text-4xl font-bold md:text-5xl">
                        My Recent Projects
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        I love making personal & business projects frequently.
                        Want to see more?{" "}
                        <Link
                            href={siteConfig.links.github}
                            className="text-accent-foreground underline underline-offset-2"
                        >
                            Click Here
                        </Link>
                        .
                    </p>
                </div>

                <div className="grid w-full grid-cols-1 justify-items-stretch gap-10 md:grid-cols-3">
                    {projectsConfig.map((project, index) => (
                        <motion.div
                            className="aspect-video overflow-hidden rounded-md border border-gray-600"
                            variants={fadeInContainer}
                            key={index}
                        >
                            <div className="group relative flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-slate-900 text-center">
                                <Image
                                    src={project.image}
                                    alt="DRVGO"
                                    width={1000}
                                    height={1000}
                                    className="absolute object-contain opacity-100 transition-all duration-300 ease-in-out group-hover:opacity-0"
                                />

                                <div className="absolute flex scale-150 flex-col justify-center gap-10 px-10 opacity-0 transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100">
                                    <p className="font-semibold">
                                        {project.name}
                                    </p>
                                    <div className="flex items-center justify-center">
                                        <Link
                                            href={project.link}
                                            className="flex items-center justify-center rounded-md bg-accent p-3 text-sm font-medium transition-all ease-in-out hover:bg-zinc-800"
                                        >
                                            View Project
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.section>
    );
}

export default Projects;
