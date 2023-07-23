"use client";

import Image from "next/image";
import { Icons } from "../icons/icons";
import Link from "next/link";
import { DefaultProps } from "@/src/types";
import DRVGOLogo from "@/public/DRVGO.svg";
import { Variants, motion } from "framer-motion";

function Landing({ className }: DefaultProps) {
    const fadeInContainer: Variants = {
        hide: {
            opacity: 0
        },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const slideInItem: Variants = {
        hide: {
            opacity: 0,
            y: 100
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <motion.section className={className}
            initial="hide"
            animate="show"
            variants={fadeInContainer}
        >
            <motion.div
                className="container max-w-[75rem] flex flex-col justify-center items-center gap-14"
                variants={slideInItem}
            >
                <motion.div
                    className="space-y-6 text-center"
                    variants={slideInItem}
                >
                    <motion.div
                        className="text-3xl md:text-4xl font-bold flex flex-col md:flex-row gap-2 items-center"
                        variants={slideInItem}
                    >
                        <Icons.sparkles className="h-7 w-7" />
                        <p>Designer, Full-Stack Developer & Musician</p>
                    </motion.div>
                    <motion.p
                        className="font-light text-base md:text-lg"
                        variants={slideInItem}
                    >
                        I design and code simple but beautiful things & I love what I do!
                    </motion.p>
                </motion.div>
                <Image
                    alt="DRVGO"
                    src={DRVGOLogo}
                    height={300}
                    width={300}
                    priority
                />
                <Link href={"/#about"} className="flex items-center justify-start gap-1 text-accent border border-accent rounded-md p-3 px-6 hover:bg-accent hover:text-background transition-all ease-in-out">
                    <p className="cursor-pointer pl-1">Know More</p>
                    <Icons.arrowRight className="h-4 w-4 cursor-pointer" />
                </Link>
            </motion.div>
        </motion.section>
    );
}

export default Landing;