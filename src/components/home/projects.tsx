"use client";

import { DefaultProps } from "@/src/types";
import Link from "next/link";
import { siteConfig } from "@/src/config/site";
import Image from "next/image";
import { Variants, motion } from "framer-motion";
import { projectsConfig } from "@/src/config/projects";

function Projects({ className }: DefaultProps) {
    const fadeInContainer: Variants = {
        hide: {
            opacity: 0,
            y: 100
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2,
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
                className="container flex flex-col gap-20 justify-center items-center max-w-[75rem] p-0 mt-20 md:mt-0"
                variants={fadeInContainer}
            >
                <div className="flex flex-col items-center gap-5 text-center">
                    <p className="text-4xl md:text-5xl font-bold">My Recent Projects</p>
                    <p className="text-gray-400 text-sm md:text-base">I love making personal & business projects frequently. Want to see more? <Link href={siteConfig.links.github} className="text-accent underline underline-offset-2">Click Here</Link>.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 justify-items-stretch gap-10 w-full">
                    {projectsConfig.map((project, index) => (
                        <motion.div
                            className="aspect-video overflow-hidden rounded-md border border-gray-600"
                            variants={fadeInContainer}
                            key={index}
                        >
                            <div className="bg-gradient-to-br from-zinc-900 to-slate-900 w-full h-full flex items-center justify-center group relative text-center">
                                <Image src={project.image} alt="DRVGO" width={1000} height={1000} className="absolute opacity-100 group-hover:opacity-0 transition-all ease-in-out duration-300 object-contain" />

                                <div className="absolute opacity-0 group-hover:opacity-100 scale-150 group-hover:scale-100 transition-all ease-in-out duration-300 px-10 flex flex-col justify-center gap-10">
                                    <p className="font-semibold">{project.name}</p>
                                    <div className="flex items-center justify-center">
                                        <Link
                                            href={project.link}
                                            className="bg-secondary hover:bg-zinc-800 p-3 flex items-center justify-center rounded-md text-sm font-medium transition-all ease-in-out"
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