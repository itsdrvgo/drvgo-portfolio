"use client";

import { DefaultProps } from "@/src/types";
import { Image, Link } from "@nextui-org/react";
import { m, Variants } from "framer-motion";
import NextImage from "next/image";
import { Sparkle } from "../global/svgs/Sparkle";

interface Skill {
    name: string;
    icon: string;
    href: string;
}

const skills: Skill[] = [
    {
        name: "HTML",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    },
    {
        name: "CSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    },
    {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        href: "https://reactjs.org/",
    },
    {
        name: "Next.JS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        href: "https://nextjs.org/",
    },
    {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        href: "https://www.typescriptlang.org/",
    },
    {
        name: "Node.JS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        href: "https://nodejs.org/en/",
    },
    {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        href: "https://www.mongodb.com/",
    },
    {
        name: "MySQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        href: "https://www.mysql.com/",
    },
    {
        name: "Tailwind CSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
        href: "https://tailwindcss.com/",
    },
    {
        name: "Blender",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg",
        href: "https://www.blender.org/",
    },
    {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
        href: "https://www.figma.com/",
    },
    {
        name: "Photoshop",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
        href: "https://www.adobe.com/products/photoshop.html",
    },
    {
        name: "Premiere Pro",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-original.svg",
        href: "https://www.adobe.com/products/premiere.html",
    },
    {
        name: "After Effects",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg",
        href: "https://www.adobe.com/products/aftereffects.html",
    },
    {
        name: "Illustrator",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
        href: "https://www.adobe.com/products/illustrator.html",
    },
];

function Skills({ className }: DefaultProps) {
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
        <section className={className}>
            <m.div
                className="container flex max-w-4xl flex-col items-center justify-center gap-20 px-0"
                variants={slideUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                <m.div
                    className="cursor-default space-y-2 text-center"
                    variants={fadeIn}
                >
                    <p className="text-4xl font-bold md:text-5xl">My Skills</p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Skills that I have mastered over the years. I am always
                        learning new things and improving my skills.
                    </p>
                </m.div>

                <m.div
                    className="relative grid basis-1/2 grid-cols-2 gap-3 md:grid-cols-4 md:gap-5"
                    variants={slideUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {skills.map((skill, index) => (
                        <m.div key={index} variants={fadeIn}>
                            <Link
                                className="z-10 flex items-center gap-5 rounded-lg border border-gray-600 bg-white/20 p-3 text-white backdrop-blur-sm md:p-5"
                                href={skill.href}
                                target="_blank"
                            >
                                <Image
                                    as={NextImage}
                                    src={skill.icon}
                                    width={30}
                                    height={30}
                                    alt={skill.name}
                                    radius="none"
                                />

                                <p className="text-base font-semibold md:text-lg">
                                    {skill.name}
                                </p>
                            </Link>
                        </m.div>
                    ))}

                    <m.div
                        className="glow-bg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        variants={fadeIn}
                    />
                </m.div>
            </m.div>

            <m.div
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
                <Sparkle className="spark-spin-1 absolute left-[10%] top-[40%]" />
                <Sparkle className="spark-spin-2 absolute left-[20%] top-[90%]" />
                <Sparkle className="spark-spin-3 absolute right-[15%] top-[70%]" />
                <Sparkle className="spark-spin-2 absolute right-[25%] top-[20%]" />
            </m.div>
        </section>
    );
}

export default Skills;
