"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Card, CardBody } from "@nextui-org/react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { Sparkle } from "../global/svgs/Sparkle";

interface Journey {
    title: string;
    description: string;
    month: string;
    year: string;
    org?: string;
    icon?: string;
}

const journey: Journey[] = [
    {
        title: "Cleared Class X Board Exams",
        description: "I passed my class X board exams with 82.5% marks.",
        org: "Baranagore Ramakrishna Mission Ashrama High School",
        month: "June",
        year: "2018",
    },
    {
        title: "Cleared Class XII Board Exams",
        description:
            "I passed my class XII board exams with 75.2% marks in Science stream.",
        org: "Baranagore Narendranath Vidyamandir",
        month: "July",
        year: "2020",
    },
    {
        title: "Beginning of Coding Journey",
        description:
            "I started my coding journey with JavaScript, specifically Discord.JS.",
        month: "June",
        year: "2021",
    },
    {
        title: "Started Learning Web Development",
        description:
            "I started learning web development with Next.JS and React.",
        month: "November",
        year: "2021",
    },
    {
        title: "Started Freelancing",
        description:
            "I started freelancing as a full-stack developer, working with clients from all over the world.",
        month: "March",
        year: "2022",
    },
    {
        title: "Graduated from College",
        description:
            "I graduated from Calcutta University with a B. Sc. degree in Microbiology with 7.02 CGPA.",
        org: "Calcutta University",
        month: "August",
        year: "2023",
    },
    {
        title: "Started Learning MERN Stack",
        description:
            "I started learning the MERN stack from Webskitters Academy, a renowned institute in Kolkata.",
        org: "Webskitters Academy",
        month: "August",
        year: "2023",
    },
];

function Journey({ className, ...props }: DefaultProps) {
    const [openIndex, setOpenIndex] = useState(-1);

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
                "relative mb-20 flex min-h-screen items-center justify-center p-5 md:mb-20",
                className
            )}
            {...props}
        >
            <motion.div
                className="relative flex max-w-4xl flex-col items-center justify-center gap-20"
                variants={slideUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                <motion.div
                    className="cursor-default space-y-2 text-center"
                    variants={fadeIn}
                >
                    <h2 className="text-4xl font-bold md:text-5xl">My Journey</h2>
                    <p className="text-sm text-white/60 md:text-base">
                        I&apos;ve been on a long journey to get to where I am
                        today. Here&apos;s a brief overview of my journey so
                        far.
                    </p>
                </motion.div>

                <motion.div
                    className="flex w-full flex-col items-center"
                    variants={slideUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {journey.map((item, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col items-center transition-all ease-in-out"
                            variants={fadeIn}
                        >
                            <div
                                className={cn(
                                    "flex cursor-default flex-col items-center justify-center transition-all ease-in-out md:flex-row",
                                    {
                                        "md:flex-row-reverse": index % 2 !== 0,
                                    },
                                    openIndex === index && "gap-5"
                                )}
                                onClick={() =>
                                    setOpenIndex(
                                        openIndex === index ? -1 : index
                                    )
                                }
                            >
                                <div>
                                    <div
                                        className={cn(
                                            "relative flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-full bg-white/10 text-sm font-semibold transition-all ease-in-out hover:bg-primary-300 md:h-20 md:w-20 md:text-base",
                                            {
                                                "bg-primary-300":
                                                    openIndex === index,
                                            }
                                        )}
                                    >
                                        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                                            <div
                                                className={cn(
                                                    "h-16 w-16 rounded-full outline-dashed outline-2 outline-offset-4 outline-primary-400 md:h-20 md:w-20",
                                                    {
                                                        "rotate-left":
                                                            index % 2 === 0,
                                                        "rotate-right":
                                                            index % 2 !== 0,
                                                    }
                                                )}
                                            />
                                        </div>

                                        <p>
                                            {item.month
                                                .slice(0, 3)
                                                .toUpperCase()}
                                        </p>
                                        <p>{item.year}</p>
                                    </div>
                                </div>

                                <div
                                    className={cn(
                                        "absolute z-20 max-w-sm flex-nowrap overflow-hidden transition-all ease-in-out",
                                        {
                                            "pointer-events-auto translate-y-0 md:translate-x-0":
                                                openIndex === index,
                                            "pointer-events-none -translate-y-full translate-x-0 opacity-0 md:translate-x-full md:translate-y-0":
                                                openIndex !== index &&
                                                index % 2 !== 0,
                                            "pointer-events-none -translate-y-full translate-x-0 opacity-0 md:-translate-x-full md:translate-y-0":
                                                openIndex !== index &&
                                                index % 2 === 0,
                                        }
                                    )}
                                >
                                    <Card>
                                        <CardBody>
                                            <div
                                                className={cn(
                                                    "flex flex-col gap-2 overflow-hidden text-center transition-all ease-in-out",
                                                    {
                                                        "opacity-0":
                                                            openIndex !== index,
                                                    }
                                                )}
                                            >
                                                <div>
                                                    <p className="text-lg font-semibold md:text-xl">
                                                        {item.title}
                                                    </p>
                                                    {item.org && (
                                                        <p className="text-xs text-white/50 md:text-sm">
                                                            from {item.org}
                                                        </p>
                                                    )}
                                                </div>

                                                <p className="text-sm text-white/80 md:text-base">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>

                            {index !== journey.length - 1 &&
                                (index % 2 === 0 ? (
                                    <div className="h-16 w-1 bg-primary-400" />
                                ) : (
                                    <div className="h-16 w-1 bg-primary-400" />
                                ))}
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{
                    opacity: 1,
                    transition: {
                        duration: 0.5,
                        delay: 0.5,
                    },
                }}
                viewport={{ once: true }}
            >
                <Sparkle className="spark-spin-1 absolute left-[30%] top-[20%]" />
                <Sparkle className="spark-spin-2 absolute left-[20%] top-[60%]" />
                <Sparkle className="spark-spin-3 absolute right-[10%] top-[20%]" />
                <Sparkle className="spark-spin-2 absolute right-[20%] top-[45%]" />
            </motion.div>
        </section>
    );
}

export default Journey;
