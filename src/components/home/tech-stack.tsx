import { skills } from "@/config/tech-stack";
import { cn } from "@/lib/utils";
import { GenericProps, Skill } from "@/types";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ElementRef, useRef } from "react";
import { DRVGO } from "../global/svgs";

export function TechStack({ className, ...props }: GenericProps) {
    const targetRef = useRef<ElementRef<"section"> | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["2%", "-95%"]);

    return (
        <section
            className={cn(
                "relative flex justify-end py-20 md:h-[300vh] md:py-0",
                className
            )}
            ref={targetRef}
            {...props}
        >
            <div className="sticky top-0 flex w-full max-w-[100rem] flex-col items-center gap-10 overflow-hidden md:h-screen md:flex-row md:gap-0">
                <h4 className="z-10 flex items-center justify-center rounded-lg bg-background text-center text-3xl md:h-full md:flex-col md:gap-4 md:pl-5 md:pr-10 md:text-5xl 2xl:text-7xl">
                    <span>T</span>
                    <span>E</span>
                    <span>C</span>
                    <span>H</span>
                    <span className="hidden md:block">|</span>
                    <span className="md:hidden"> - </span>
                    <span>S</span>
                    <span>T</span>
                    <span>A</span>
                    <span>C</span>
                    <span>K</span>
                </h4>

                <div className="flex h-[450px] w-full justify-center md:hidden">
                    <GlobeRotation />
                </div>

                <motion.div style={{ x }} className="hidden gap-4 md:flex">
                    <div className="flex size-[450px] overflow-hidden">
                        <GlobeRotation />
                    </div>

                    {skills.map((skill) => (
                        <SkillCard skill={skill} key={skill.name} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function SkillCard({ skill }: { skill: Skill }) {
    return (
        <div
            key={skill.name}
            className="flex size-[450px] flex-col justify-between gap-5 overflow-hidden text-balance rounded-lg border bg-foreground/40 p-5 text-background drop-shadow-md transition-all ease-in-out hover:bg-foreground/80"
        >
            <div className="aspect-video overflow-hidden rounded-md">
                <Image
                    src={skill.image}
                    alt={skill.name}
                    className="object-cover"
                    width={500}
                    height={500}
                />
            </div>

            <div>
                <div className="space-y-1">
                    <Link
                        href={skill.href}
                        className="group/link flex w-fit items-center gap-1 font-medium hover:underline"
                        target="_blank"
                    >
                        View Docs
                    </Link>

                    <p className="text-background/60">{skill.description}</p>
                </div>

                <h4 className="text-xl">{skill.name}</h4>
            </div>
        </div>
    );
}

function GlobeRotation() {
    return (
        <div className="relative w-full">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-foreground p-2 text-center drop-shadow-md">
                <div>
                    <DRVGO width={50} height={50} />
                </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="spin_box_1 relative size-32 rounded-full border border-foreground/20 md:size-40">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background p-2 drop-shadow-md">
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                            alt="HTML"
                            width={30}
                            height={30}
                        />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-180 rounded-full bg-background p-2 drop-shadow-md">
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                            alt="CSS"
                            width={30}
                            height={30}
                        />
                    </div>
                </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="spin_box_2 relative size-52 rounded-full border border-foreground/15 md:size-64">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground p-2 drop-shadow-md">
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                            alt="React"
                            width={30}
                            height={30}
                        />
                    </div>

                    <div className="absolute left-[calc(50%-50%*sin(60deg))] top-[calc(50%+50%*cos(60deg))] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background p-2 drop-shadow-md">
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                            alt="NextJS"
                            width={30}
                            height={30}
                            className="rotate-[235deg]"
                        />
                    </div>

                    <div className="absolute left-[calc(50%+50%*sin(60deg))] top-[calc(50%+50%*cos(60deg))] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background p-1 drop-shadow-md">
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
                            alt="NextJS"
                            width={30}
                            height={30}
                            className="rotate-[120deg]"
                        />
                    </div>
                </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="spin_box_3 relative size-72 rounded-full border border-foreground/10 md:size-[22rem]">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background p-2 drop-shadow-md">
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
                            alt="PostgreSQL"
                            width={30}
                            height={30}
                        />
                    </div>

                    <div className="absolute left-[calc(50%-50%*sin(60deg))] top-[calc(50%+50%*cos(60deg))] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background p-2 drop-shadow-md">
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                            alt="NodeJS"
                            width={30}
                            height={30}
                            className="rotate-[210deg]"
                        />
                    </div>

                    <div className="absolute left-[calc(50%+50%*sin(60deg))] top-[calc(50%+50%*cos(60deg))] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background p-2 drop-shadow-md">
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                            alt="NodeJS"
                            width={30}
                            height={30}
                            className="rotate-[120deg]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
