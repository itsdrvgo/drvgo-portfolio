"use client";

import { DRVGOIcon } from "@/src/config/const";
import { DefaultProps } from "@/src/types";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "../icons/icons";

function Landing({ className }: DefaultProps) {
    const fadeInContainer: Variants = {
        hide: {
            opacity: 0,
        },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const slideInItem: Variants = {
        hide: {
            opacity: 0,
            y: 100,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <motion.section
            className={className}
            initial="hide"
            animate="show"
            variants={fadeInContainer}
        >
            <motion.div
                className="container flex max-w-[75rem] flex-col-reverse items-center justify-between gap-10 px-2 md:flex-row"
                variants={slideInItem}
            >
                <motion.div
                    className="space-y-10 text-center md:text-left"
                    variants={slideInItem}
                >
                    <motion.div className="flex flex-col items-center gap-2 md:items-start">
                        <motion.p
                            className="ml-1 text-xl font-semibold drop-shadow-lg md:text-2xl"
                            variants={slideInItem}
                        >
                            Welcome to
                        </motion.p>
                        <motion.h1
                            className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-5xl font-bold text-transparent drop-shadow-lg md:text-7xl"
                            variants={slideInItem}
                        >
                            DRVGO
                        </motion.h1>
                        <motion.div
                            className="mt-2 flex gap-1"
                            variants={slideInItem}
                        >
                            <motion.div className="ml-1 h-2 w-20 rounded-md bg-blue-600" />
                            <motion.div className="ml-1 h-2 w-8 rounded-md bg-accent-foreground" />
                            <motion.div className="ml-1 h-2 w-2 rounded-md bg-white" />
                        </motion.div>
                    </motion.div>

                    <motion.div className="ml-1 flex flex-col items-center gap-4 md:items-start">
                        <motion.p
                            className="flex w-11/12 flex-col items-center gap-2 text-2xl font-semibold drop-shadow-lg md:flex-row md:text-4xl"
                            variants={slideInItem}
                        >
                            Designer, Full-Stack Developer & Musician
                        </motion.p>
                        <motion.p
                            className="w-3/5 text-sm font-light text-gray-400 drop-shadow-lg md:text-base"
                            variants={slideInItem}
                        >
                            I design and code simple but beautiful things & I
                            love what I do!
                        </motion.p>
                    </motion.div>

                    <motion.div className="ml-1 flex justify-center md:justify-start">
                        <Link
                            href={"/#about"}
                            className="flex w-max items-center justify-start gap-1 rounded-md border border-gray-600 p-3 px-6 text-accent-foreground transition-all ease-in-out hover:bg-accent-foreground hover:text-black"
                        >
                            <p className="cursor-pointer pl-1">Know More</p>
                            <Icons.arrowRight className="h-4 w-4 cursor-pointer" />
                        </Link>
                    </motion.div>
                </motion.div>
                <Image
                    alt="DRVGO"
                    src={DRVGOIcon}
                    height={500}
                    width={500}
                    priority
                />
            </motion.div>
        </motion.section>
    );
}

export default Landing;
