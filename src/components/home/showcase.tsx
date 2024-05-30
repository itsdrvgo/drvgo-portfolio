"use client";

import CreateEV0App from "@/../public/projects/create_ev0_app.jpeg";
import PeerAmpFS from "@/../public/projects/peeramp_fs.jpeg";
import PostItBG from "@/../public/projects/post_it.jpeg";
import PrimeBot from "@/../public/projects/prime_bot.jpeg";
import Routez from "@/../public/projects/routez.jpeg";
import XarOSBG from "@/../public/projects/xar_os.jpeg";
import { GITHUB_BASE_URL } from "@/config/const";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Icons } from "../icons";

interface Project {
    name: string;
    description: string;
    source: string;
    demo?: string;
    thumbnail: StaticImageData;
}

const projects: Project[] = [
    {
        name: "Post It",
        description:
            "A simple rip-off of social media apps like Twitter, Facebook, Instagram, etc.",
        source: GITHUB_BASE_URL + "itsdrvgo/post-it",
        demo: "https://post-it-itsdrvgo.vercel.app/",
        thumbnail: PostItBG,
    },
    {
        name: "Routez",
        description: "Next.JS like file-based routing for Express.js",
        source: GITHUB_BASE_URL + "itsdrvgo/routez",
        thumbnail: Routez,
    },
    {
        name: "PeerAmp File Server",
        description: "The official server of PeerAmp to handle files",
        source: GITHUB_BASE_URL + "itsdrvgo/peeramp-file-server",
        thumbnail: PeerAmpFS,
    },
    {
        name: "Create EV0 App",
        description:
            "The best way to start your next Next.js project in a type-safe environment.",
        source: GITHUB_BASE_URL + "itsdrvgo/create-ev0-app",
        demo: "https://ev0.vercel.app/",
        thumbnail: CreateEV0App,
    },
    {
        name: "XAR OS",
        description:
            "A stunning and feature-rich MacOS clone created using Next.JS.",
        source: GITHUB_BASE_URL + "itsdrvgo/xar-os",
        demo: "https://xar-os.vercel.app/",
        thumbnail: XarOSBG,
    },
    {
        name: "Prime (Discord Bot)",
        description:
            "PayPal integrated Discord bot for managing orders, payments, etc.",
        source: GITHUB_BASE_URL + "itsdrvgo/prime-bot",
        thumbnail: PrimeBot,
    },
];

export function Showcase({ className, ...props }: GenericProps) {
    return (
        <section
            className={cn(
                "flex min-h-screen items-center justify-center bg-primary p-5 py-20",
                className
            )}
            style={{
                backgroundImage: "url(/noise-light.png)",
            }}
            {...props}
        >
            <div className="flex w-full max-w-7xl flex-col-reverse gap-10 md:flex-row md:gap-24">
                <div className="grid w-full gap-5 md:grid-cols-3 md:gap-10">
                    {projects.map((project, i) => (
                        <div
                            className={cn(
                                "group relative h-52 w-full overflow-hidden rounded-2xl border border-foreground/10 shadow-lg drop-shadow-lg",
                                (i === 0 || i == 3 || i == 4) && "md:col-span-2"
                            )}
                            key={i}
                        >
                            <Image
                                src={project.thumbnail}
                                alt={project.name}
                                className="size-full object-cover"
                            />

                            <div className="absolute left-0 top-0 flex size-full flex-col justify-end gap-2 text-balance bg-foreground/40 p-5 text-background transition-all ease-in-out group-hover:bg-foreground/80">
                                <div className="-translate-y-full space-y-1 opacity-0 transition-all ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
                                    <Link
                                        href={project.demo ?? project.source}
                                        className="group/link flex w-fit items-center gap-1 font-medium hover:underline"
                                        target="_blank"
                                    >
                                        {project.demo
                                            ? "View Demo"
                                            : "View Source"}

                                        <Icons.chevronRight className="size-0 transition-all ease-in-out group-hover/link:size-5" />
                                    </Link>

                                    <p className="text-background/60">
                                        {project.description}
                                    </p>
                                </div>

                                <h4 className="text-xl">{project.name}</h4>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="flex text-center text-4xl uppercase text-background selection:bg-white selection:text-foreground md:flex-col md:gap-4 md:text-7xl">
                    <span>S</span>
                    <span>H</span>
                    <span>O</span>
                    <span>W</span>
                    <span>C</span>
                    <span>A</span>
                    <span>S</span>
                    <span>E</span>
                </h3>
            </div>
        </section>
    );
}
