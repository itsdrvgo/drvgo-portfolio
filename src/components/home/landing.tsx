"use client";

import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Image } from "@nextui-org/react";
import { motion, Variants } from "framer-motion";
import NextImage from "next/image";
import DRVGOBitMojiHi from "public/drvgo_bitmoji_hi.webp";
import { Smiley } from "../global/svgs/Smiley";
import { Sparkle } from "../global/svgs/Sparkle";
import {
    SurpriseSparkleLeft,
    SurpriseSparkleRight,
} from "../global/svgs/SurpriseSpark";

function Landing({ className, ...props }: DefaultProps) {
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
                "relative flex h-full min-h-screen cursor-default items-center justify-center p-5",
                className
            )}
            {...props}
        >
            <motion.div
                className="z-20 flex h-full w-full flex-col items-center justify-center gap-6 text-center md:gap-10"
                variants={slideUp}
                initial="hidden"
                animate="show"
            >
                <motion.div
                    className="pointer-events-none select-none"
                    variants={fadeIn}
                >
                    <Image
                        as={NextImage}
                        src={DRVGOBitMojiHi.src}
                        alt={siteConfig.name}
                        width={100}
                        height={100}
                        radius="full"
                        priority
                    />
                </motion.div>

                <motion.div
                    className="flex items-end gap-0 md:gap-4"
                    variants={fadeIn}
                >
                    <SurpriseSparkleLeft height={80} width={80} />

                    <p className="bg-gradient-to-r from-yellow-400 via-blue-700 to-red-500 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
                        Full Stack Developer
                    </p>

                    <SurpriseSparkleRight height={80} width={80} />
                </motion.div>

                <motion.div
                    className="flex items-center gap-3"
                    variants={fadeIn}
                >
                    <p className="text-lg md:text-xl">Ayo, I&apos;m DRVGO</p>
                    <Smiley />
                </motion.div>

                <motion.p
                    className="max-w-xs text-base text-white/80 md:max-w-xl md:text-lg"
                    variants={fadeIn}
                >
                    A dedicated full-stack developer, I&apos;m passionate about
                    crafting seamless web solutions. With expertise in Next.js,
                    React, and more, I thrive on transforming complex ideas into
                    user-friendly applications. My commitment to staying at the
                    forefront of emerging technologies drives me to deliver
                    excellence in every project I undertake. Whether it&apos;s a
                    personal website or a robust web application, I take pride
                    in exceeding expectations and ensuring top-notch quality in
                    every endeavor.
                </motion.p>
            </motion.div>

            <motion.div
                className="glow-bg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    transition: {
                        duration: 0.5,
                    },
                }}
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    transition: {
                        duration: 0.5,
                    },
                }}
            >
                <Sparkle className="spark-spin-1 absolute left-[10%] top-[10%]" />
                <Sparkle className="spark-spin-2 absolute left-[20%] top-[40%]" />
                <Sparkle className="spark-spin-3 absolute right-[20%] top-[80%]" />
                <Sparkle className="spark-spin-2 absolute right-[10%] top-[20%]" />
            </motion.div>
        </section>
    );
}

export default Landing;
