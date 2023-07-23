"use client";

import { DefaultProps } from "@/src/types";
import Link from "next/link";
import { siteConfig } from "@/src/config/site";
import SkeletonImage from "@/public/station_neon.jpg";
import Image from "next/image";
import { Variants, motion } from "framer-motion";

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[75rem]">
                    <motion.div
                        className="aspect-video overflow-hidden object-contain rounded-md border border-gray-300"
                        variants={fadeInContainer}
                    >
                        <Image src={SkeletonImage} alt="skeleton" height={400} width={400} />
                    </motion.div>
                    <motion.div
                        className="aspect-video overflow-hidden object-contain rounded-md border border-gray-300"
                        variants={fadeInContainer}
                    >
                        <Image src={SkeletonImage} alt="skeleton" height={400} width={400} />
                    </motion.div>
                    <motion.div
                        className="aspect-video overflow-hidden object-contain rounded-md border border-gray-300"
                        variants={fadeInContainer}
                    >
                        <Image src={SkeletonImage} alt="skeleton" height={400} width={400} />
                    </motion.div>
                    <motion.div
                        className="aspect-video overflow-hidden object-contain rounded-md border border-gray-300"
                        variants={fadeInContainer}
                    >
                        <Image src={SkeletonImage} alt="skeleton" height={400} width={400} />
                    </motion.div>
                    <motion.div
                        className="aspect-video overflow-hidden object-contain rounded-md border border-gray-300"
                        variants={fadeInContainer}
                    >
                        <Image src={SkeletonImage} alt="skeleton" height={400} width={400} />
                    </motion.div>
                    <motion.div
                        className="aspect-video overflow-hidden object-contain rounded-md border border-gray-300"
                        variants={fadeInContainer}
                    >
                        <Image src={SkeletonImage} alt="skeleton" height={400} width={400} />
                    </motion.div>
                </div>
            </motion.div>
        </motion.section>
    );
}

export default Projects;