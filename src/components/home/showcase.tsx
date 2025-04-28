"use client";

import CreateEV0App from "@/../public/projects/create_ev0_app.jpeg";
import Cryptor from "@/../public/projects/cryptor.jpeg";
import PeerAmpFS from "@/../public/projects/peeramp_fs.jpeg";
import PostItBG from "@/../public/projects/post_it.jpeg";
import PrimeBot from "@/../public/projects/prime_bot.jpeg";
import Routez from "@/../public/projects/routez.jpeg";
import XarOSBG from "@/../public/projects/xar_os.jpeg";
import { GITHUB_BASE_URL } from "@/config/const";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icons } from "../icons";

interface Project {
    name: string;
    description: string;
    source: string;
    demo?: string;
    thumbnail: StaticImageData;
    isActive?: boolean;
}

const projects: Project[] = [
    {
        name: "Post It",
        description:
            "A simple rip-off of social media apps like Twitter, Facebook, Instagram, etc.",
        source: GITHUB_BASE_URL + "itsdrvgo/post-it",
        demo: "https://post-it-itsdrvgo.vercel.app/",
        thumbnail: PostItBG,
        isActive: true,
    },
    {
        name: "Routez",
        description: "Next.JS like file-based routing for Express.js",
        source: GITHUB_BASE_URL + "itsdrvgo/routez",
        thumbnail: Routez,
        isActive: true,
    },
    {
        name: "PeerAmp File Server",
        description: "The official server of PeerAmp to handle files",
        source: GITHUB_BASE_URL + "itsdrvgo/peeramp-file-server",
        thumbnail: PeerAmpFS,
        isActive: true,
    },
    {
        name: "Cryptor",
        description:
            "A simple, secure, and fast encryption and decryption tool",
        source: GITHUB_BASE_URL + "itsdrvgo/cryptor",
        demo: "https://cryptor-itsdrvgo.vercel.app/",
        thumbnail: Cryptor,
        isActive: true,
    },
    {
        name: "Create EV0 App",
        description:
            "The best way to start your next Next.js project in a type-safe environment.",
        source: GITHUB_BASE_URL + "itsdrvgo/create-ev0-app",
        demo: "https://ev0.vercel.app/",
        thumbnail: CreateEV0App,
        isActive: true,
    },
    {
        name: "XAR OS",
        description:
            "A stunning and feature-rich MacOS clone created using Next.JS.",
        source: GITHUB_BASE_URL + "itsdrvgo/xar-os",
        demo: "https://xar-os.vercel.app/",
        thumbnail: XarOSBG,
        isActive: true,
    },
    {
        name: "Prime (Discord Bot)",
        description:
            "PayPal integrated Discord bot for managing orders, payments, etc.",
        source: GITHUB_BASE_URL + "itsdrvgo/prime-bot",
        thumbnail: PrimeBot,
    },
];

export function Showcase({ className }: GenericProps) {
    const showcaseLetters = "SHOWCASE".split("");

    return (
        <section
            className={cn(
                "flex min-h-screen items-center justify-center bg-primary p-5 py-20",
                className
            )}
            style={{
                backgroundImage: "url(/noise-light.png)",
            }}
        >
            <div className="flex w-full max-w-7xl flex-col-reverse items-center gap-10 md:flex-row md:gap-24">
                <motion.div
                    className="grid w-full gap-5 md:grid-cols-3 md:gap-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {projects
                        .filter((project) => project.isActive)
                        .map((project, i) => (
                            <ProjectCard
                                project={project}
                                index={i}
                                key={project.name}
                                colSpan={
                                    i === 0 || i === 3 || i === 4 ? true : false
                                }
                                lastItem={
                                    projects.length % 2 !== 0 &&
                                    i === projects.length - 1
                                }
                            />
                        ))}
                </motion.div>

                <motion.h3
                    className="flex text-center text-4xl text-background uppercase selection:bg-white selection:text-foreground md:flex-col md:gap-4 md:text-7xl"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {showcaseLetters.map((letter, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.1,
                                ease: "easeOut",
                            }}
                            whileHover={{
                                scale: 1.1,
                                color: "#ffffff",
                                transition: { duration: 0.2 },
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.h3>
            </div>
        </section>
    );
}

function ProjectCard({
    project,
    index,
    colSpan,
    lastItem,
}: {
    project: Project;
    index: number;
    colSpan: boolean;
    lastItem: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={cn(
                "group relative h-52 w-full overflow-hidden rounded-2xl border shadow-lg",
                colSpan && "md:col-span-2",
                lastItem && "md:col-span-3"
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.1,
            }}
            whileHover={{
                scale: 1.03,
                transition: { duration: 0.2 },
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Image
                src={project.thumbnail}
                alt={project.name}
                className="size-full object-cover"
            />

            <motion.div
                className="absolute top-0 left-0 flex size-full flex-col justify-end gap-2 p-5 text-balance text-background"
                initial={{ backgroundColor: "rgba(15, 15, 15, 0.4)" }}
                animate={{
                    backgroundColor: isHovered
                        ? "rgba(15, 15, 15, 0.8)"
                        : "rgba(15, 15, 15, 0.4)",
                }}
                transition={{ duration: 0.2 }}
            >
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            className="space-y-1"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link
                                href={project.demo ?? project.source}
                                className="group/link flex w-fit items-center gap-1 font-medium hover:underline"
                                target="_blank"
                            >
                                {project.demo ? "View Demo" : "View Source"}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "auto" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Icons.ChevronRight className="size-5" />
                                </motion.div>
                            </Link>
                            <motion.p
                                className="text-background/60"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                {project.description}
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.h4
                    className="text-xl"
                    animate={{
                        y: isHovered ? 0 : 0,
                        transition: { duration: 0.2 },
                    }}
                >
                    {project.name}
                </motion.h4>
            </motion.div>
        </motion.div>
    );
}
