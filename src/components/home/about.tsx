"use client";

import Image from "next/image";
import { Variants, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import DRVGOLogo from "@/public/DRVGO.svg";
import { DefaultProps } from "@/src/types";

function About({ className }: DefaultProps) {
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
            id="about"
        >
            <motion.div
                className="container max-w-[75rem] grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-24 items-center bg-gradient-to-b md:bg-gradient-to-r from-transparent to-primary rounded-md"
                variants={fadeInContainer}
            >
                <div className="items-center justify-center hidden md:visible md:flex">
                    <Image src={DRVGOLogo} alt="DRVGO" />
                </div>
                <Card className="order-1 p-0 md:pt-10 pb-5 bg-transparent border-none">
                    <CardHeader className="p-2 md:p-6">
                        <CardTitle className="text-3xl md:text-4xl font-bold">About Me</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-7 p-2 md:p-6">
                        <Separator className="h-[2px] w-12 bg-blue-300" />

                        <motion.p
                            className="font-normal text-base md:text-lg"
                            variants={fadeInContainer}
                        >
                            Hey there, I'm DRVGO, a passionate full-stack web developer & musician based in India.
                        </motion.p>

                        <div className="space-y-3 font-light text-sm md:text-base text-gray-300 overflow-hidden">
                            <motion.p
                                variants={fadeInContainer}
                            >
                                With expertise in React, Next.js, and TypeScript, I love crafting seamless, user-friendly web applications. My journey in the world of coding began in 2021, and I've been on a constant pursuit of innovation ever since.
                            </motion.p>

                            <motion.p
                                variants={fadeInContainer}
                            >
                                I believe in the power of collaboration, working closely with clients to understand their unique visions and turn them into reality. Staying up-to-date with the latest industry trends allows me to deliver cutting-edge solutions that leave a lasting impact.
                            </motion.p>

                            <motion.p
                                variants={fadeInContainer}
                            >
                                Beyond coding, I find inspiration in experimenting with Music. Since childhood, I had an affection to it, but after 2018, it bloomed. Since then, I've made, covered, collaborated on 100+ tracks, along with original compositions.

                            </motion.p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.section>
    );
}

export default About;