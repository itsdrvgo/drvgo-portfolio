import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import React, { useRef } from "react";

function Landing({ className }: DefaultProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const backgroundFullY = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", "100%"]
    );
    const backgroundHalfY = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", "50%"]
    );
    const backgroundQuarterY = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", "25%"]
    );

    const textDiv = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const introText = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
    const introTextTitle = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", "150%"]
    );
    const introTextUnderline = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", "2000%"]
    );
    const descText = useTransform(scrollYProgress, [0, 1], ["0%", "400%"]);

    const container: Variants = {
        hide: {
            opacity: 0,
        },
        show: {
            opacity: 1,
            transition: {
                delay: 1.5,
                staggerChildren: 0.1,
                duration: 0.5,
            },
        },
    };

    const item: Variants = {
        hide: {
            opacity: 0,
            y: 200,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 1.5,
                duration: 0.5,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div
            className={cn("flex items-center justify-center", className)}
            ref={ref}
        >
            <motion.div
                className="z-20 w-full bg-white/10 p-10 text-center backdrop-blur-sm"
                style={{
                    y: textDiv,
                }}
                variants={container}
                initial="hide"
                animate="show"
            >
                <motion.p
                    className="text-2xl font-bold text-white"
                    style={{
                        y: introText,
                    }}
                    variants={item}
                >
                    Welcome to
                </motion.p>

                <motion.h1
                    className={cn(
                        "text-7xl font-bold drop-shadow-xl md:text-9xl",
                        "bg-gradient-to-r from-violet-200 to-pink-200 bg-clip-text text-transparent"
                    )}
                    style={{
                        y: introTextTitle,
                    }}
                    variants={item}
                >
                    DRVGO
                </motion.h1>

                <motion.div
                    className="mt-5 flex items-center justify-center gap-1"
                    style={{
                        y: introTextUnderline,
                    }}
                    variants={item}
                >
                    <motion.div className="ml-1 h-2 w-2 rounded-md bg-white drop-shadow-xl" />
                    <motion.div className="ml-1 h-2 w-8 rounded-md bg-accent drop-shadow-xl" />
                    <motion.div className="ml-1 h-2 w-20 rounded-md bg-blue-600 drop-shadow-xl" />
                    <motion.div className="ml-1 h-2 w-8 rounded-md bg-accent drop-shadow-xl" />
                    <motion.div className="ml-1 h-2 w-2 rounded-md bg-white drop-shadow-xl" />
                </motion.div>

                <motion.p
                    className="mt-10 text-base text-gray-300 md:mt-20 md:text-xl"
                    style={{
                        y: descText,
                    }}
                    variants={item}
                >
                    I design and code simple but beautiful things & I love what
                    I do!
                </motion.p>
            </motion.div>

            <motion.div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(/mountain-full.png)`,
                    backgroundPosition: "bottom",
                    backgroundSize: "cover",
                    y: backgroundFullY,
                    opacity: 0.7,
                }}
            />
            <motion.div
                className="absolute inset-0 z-10"
                style={{
                    backgroundImage: `url(/bottom-half.png)`,
                    backgroundPosition: "bottom",
                    backgroundSize: "cover",
                    y: backgroundHalfY,
                    opacity: 0.8,
                }}
            />
            <motion.div
                className="absolute inset-0 z-30"
                style={{
                    backgroundImage: `url(/bottom-quarter.png)`,
                    backgroundPosition: "bottom",
                    backgroundSize: "cover",
                    y: backgroundQuarterY,
                    opacity: 0.9,
                }}
            />
            <div
                className="absolute inset-0 z-40"
                style={{
                    backgroundImage: `url(/mountain-bottom.png)`,
                    backgroundPosition: "bottom",
                    backgroundSize: "cover",
                }}
            />
        </div>
    );
}

export default Landing;
