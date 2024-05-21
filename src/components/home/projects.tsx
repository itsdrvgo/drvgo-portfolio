"use client";

import { GITHUB_BASE_URL } from "@/src/config/const";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Button, Image, Link } from "@nextui-org/react";
import { motion, Variants } from "framer-motion";
import NextImage from "next/image";
import CreateEV0App from "public/projects/create_ev0_app.jpeg";
import PeerAmpFS from "public/projects/peeramp_fs.jpeg";
import PostItBG from "public/projects/post_it.jpeg";
import Routez from "public/projects/routez.jpeg";
import XarOSBG from "public/projects/xar_os.jpeg";
import { Sparkle } from "../global/svgs/Sparkle";

interface Project {
    name: string;
    description: string;
    source?: string;
    demo?: string;
    thumbnail?: string;
}

const projects: Project[] = [
    {
        name: "Post It",
        description:
            "A simple rip-off of social media apps like Twitter, Facebook, Instagram, etc.",
        source: GITHUB_BASE_URL + "itsdrvgo/post-it",
        demo: "https://post-it-itsdrvgo.vercel.app/",
        thumbnail: PostItBG.src,
    },
    {
        name: "Routez",
        description: "Next.JS like file-based routing for Express.js",
        source: GITHUB_BASE_URL + "itsdrvgo/routez",
        thumbnail: Routez.src,
    },
    {
        name: "Create EV0 App",
        description:
            "The best way to start your next Next.js project in a type-safe environment.",
        source: GITHUB_BASE_URL + "itsdrvgo/create-ev0-app",
        demo: "https://ev0.vercel.app/",
        thumbnail: CreateEV0App.src,
    },
    {
        name: "PeerAmp File Server",
        description: "The official server of PeerAmp to handle files",
        source: GITHUB_BASE_URL + "itsdrvgo/peeramp-file-server",
        thumbnail: PeerAmpFS.src,
    },
    {
        name: "XAR OS",
        description:
            "A stunning and feature-rich MacOS clone created using Next.JS.",
        source: GITHUB_BASE_URL + "itsdrvgo/xar-os",
        demo: "https://xar-os.vercel.app/",
        thumbnail: XarOSBG.src,
    },
];

function Projects({ className, ...props }: DefaultProps) {
    const slideUp: Variants = {
        hidden: {
            y: 100,
        },
        show: {
            y: 0,
            transition: {
                staggerChildren: 0.2,
                ease: "easeInOut",
            },
        },
    };

    const fadeIn: Variants = {
        hidden: {
            opacity: 0,
        },
        show: {
            opacity: 1,
        },
    };

    return (
        <section
            className={cn(
                "relative mb-60 flex min-h-screen items-center justify-center p-5 md:mb-40",
                className
            )}
            id="projects"
            {...props}
        >
            <motion.div
                className="relative flex w-full max-w-4xl flex-col items-center justify-center gap-10 md:gap-20"
                variants={slideUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                <motion.div
                    className="cursor-default space-y-2 text-center"
                    variants={fadeIn}
                >
                    <h2 className="text-4xl font-bold md:text-5xl">Projects</h2>
                    <p className="text-sm text-white/60 md:text-base">
                        A list of the best of what I have built over the years.
                    </p>
                </motion.div>

                <motion.div
                    className="grid w-full gap-4 md:grid-flow-col"
                    variants={slideUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <ProjectCard
                        project={projects[0]}
                        isFirstItem
                        fadeIn={fadeIn}
                    />

                    <motion.div
                        className="grid grid-cols-2 gap-2"
                        variants={slideUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {projects.slice(1).map((project, index) => (
                            <ProjectCard
                                key={index}
                                project={project}
                                fadeIn={fadeIn}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{
                    opacity: 1,
                    transition: {
                        duration: 0.5,
                        delay: 0.5,
                    },
                }}
                viewport={{ once: true }}
            >
                <Sparkle className="spark-spin-1 absolute left-[10%] top-[40%]" />
                <Sparkle className="spark-spin-2 absolute left-[20%] top-[90%]" />
                <Sparkle className="spark-spin-3 absolute right-[15%] top-[70%]" />
                <Sparkle className="spark-spin-2 absolute right-[10%] top-[20%]" />
            </motion.div>
        </section>
    );
}

export default Projects;

function ProjectCard({
    project,
    isFirstItem,
    fadeIn,
}: {
    project: Project;
    isFirstItem?: boolean;
    fadeIn: Variants;
}) {
    return (
        <motion.div
            className="group relative cursor-pointer overflow-hidden rounded-md"
            variants={fadeIn}
        >
            <Image
                as={NextImage}
                src={project.thumbnail}
                alt={project.name}
                radius="none"
                width={1000}
                height={1000}
                classNames={{
                    wrapper: cn(
                        isFirstItem && "h-full",
                        "overflow-hidden border border-white/20"
                    ),
                    img: cn(isFirstItem && "h-full"),
                }}
            />

            <div className="absolute left-0 top-0 z-40 flex size-full translate-y-full flex-col items-center justify-center gap-5 bg-black/80 p-4 opacity-0 transition-all ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
                <div className="space-y-2 text-center">
                    <p
                        className={cn(
                            "font-bold",
                            isFirstItem ? "text-xl" : "text-base md:text-xl"
                        )}
                    >
                        {project.name}
                    </p>
                    <p
                        className={cn(
                            "text-white/80",
                            isFirstItem ? "text-sm" : "text-xs md:text-sm"
                        )}
                    >
                        {project.description}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {project.demo && (
                        <Button
                            as={Link}
                            href={project.demo}
                            color="danger"
                            size="sm"
                            radius="sm"
                            className="bg-red-700"
                            isExternal
                        >
                            Demo
                        </Button>
                    )}

                    {project.source && (
                        <Button
                            as={Link}
                            href={project.source}
                            size="sm"
                            radius="sm"
                            isExternal
                        >
                            Source
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
