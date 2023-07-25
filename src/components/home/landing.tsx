"use client";

import DRVGOLogo from "@/public/DRVGO.svg";
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
                className="container flex max-w-[75rem] flex-col items-center justify-center gap-14"
                variants={slideInItem}
            >
                <motion.div
                    className="space-y-6 text-center"
                    variants={slideInItem}
                >
                    <motion.div
                        className="flex flex-col items-center gap-2 text-3xl font-bold md:flex-row md:text-4xl"
                        variants={slideInItem}
                    >
                        <Icons.sparkles className="h-7 w-7" />
                        <p>Designer, Full-Stack Developer & Musician</p>
                    </motion.div>
                    <motion.p
                        className="text-base font-light text-gray-400 md:text-lg"
                        variants={slideInItem}
                    >
                        I design and code simple but beautiful things & I love
                        what I do!
                    </motion.p>
                </motion.div>
                <Image
                    alt="DRVGO"
                    src={DRVGOLogo}
                    height={300}
                    width={300}
                    priority
                />
                <Link
                    href={"/#about"}
                    className="flex items-center justify-start gap-1 rounded-md border border-accent p-3 px-6 text-accent-foreground transition-all ease-in-out hover:bg-accent"
                >
                    <p className="cursor-pointer pl-1">Know More</p>
                    <Icons.arrowRight className="h-4 w-4 cursor-pointer" />
                </Link>
            </motion.div>
        </motion.section>
    );
}

export default Landing;
