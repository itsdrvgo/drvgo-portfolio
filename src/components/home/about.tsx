"use client";

import { DRVGOIcon } from "@/src/config/const";
import { DefaultProps } from "@/src/types";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

function About({ className }: DefaultProps) {
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
            id="about"
        >
            <motion.div
                className="container grid max-w-[75rem] grid-cols-1 items-center gap-5 rounded-md bg-gradient-to-b from-transparent to-card backdrop-blur-sm md:grid-cols-2 md:gap-24 md:bg-gradient-to-r"
                variants={fadeInContainer}
            >
                <div className="flex items-center justify-center">
                    <Image src={DRVGOIcon} alt="DRVGO" />
                </div>
                <Card className="order-1 border-none bg-transparent p-0 pb-5 md:pt-10">
                    <CardHeader className="p-2 md:p-6">
                        <CardTitle className="text-3xl font-bold md:text-4xl">
                            About Me
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-7 p-2 md:p-6">
                        <Separator className="h-[2px] w-12 bg-blue-300" />

                        <motion.p
                            className="text-base font-normal md:text-lg"
                            variants={fadeInContainer}
                        >
                            Hey there, I&apos;m DRVGO, a passionate full-stack
                            web developer & musician based in India.
                        </motion.p>

                        <div className="space-y-3 overflow-hidden text-sm font-light text-gray-300 md:text-base">
                            <motion.p variants={fadeInContainer}>
                                With expertise in React, Next.js, and
                                TypeScript, I love crafting seamless,
                                user-friendly web applications. My journey in
                                the world of coding began in 2021, and I&apos;ve
                                been on a constant pursuit of innovation ever
                                since.
                            </motion.p>

                            <motion.p variants={fadeInContainer}>
                                I believe in the power of collaboration, working
                                closely with clients to understand their unique
                                visions and turn them into reality. Staying
                                up-to-date with the latest industry trends
                                allows me to deliver cutting-edge solutions that
                                leave a lasting impact.
                            </motion.p>

                            <motion.p variants={fadeInContainer}>
                                Beyond coding, I find inspiration in
                                experimenting with Music. Since childhood, I had
                                an affection to it, but after 2018, it bloomed.
                                Since then, I&apos;ve made, covered,
                                collaborated on 100+ tracks, along with original
                                compositions.
                            </motion.p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.section>
    );
}

export default About;
