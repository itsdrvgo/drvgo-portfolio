import { skills } from "@/config/tech-stack";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { DRVGO } from "../globals/svgs";
import { Separator } from "../ui/separator";

export function TechStack({ className, ...props }: GenericProps) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["2%", "-95%"]);
    const techStackLetters = "TECH|STACK".split("");

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
                <motion.h4
                    className="z-10 flex items-center justify-center rounded-lg bg-background text-center text-3xl md:h-full md:flex-col md:gap-4 md:pr-10 md:pl-5 md:text-5xl 2xl:text-7xl"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {techStackLetters.map((letter, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.1,
                                ease: "easeOut",
                            }}
                            whileHover={{
                                scale: 1.2,
                                color: "var(--primary)",
                                transition: { duration: 0.2 },
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.h4>

                <motion.div
                    className="flex h-[450px] w-full justify-center md:hidden"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <GlobeRotation />
                </motion.div>

                <motion.div
                    style={{ x }}
                    className="hidden gap-4 md:flex"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <motion.div
                        className="flex size-[450px] overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <GlobeRotation />
                    </motion.div>

                    {skills.map((skill, index) => (
                        <SkillCard
                            skill={skill}
                            key={skill.name}
                            index={index}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function SkillCard({
    skill,
    index,
}: {
    skill: (typeof skills)[number];
    index: number;
}) {
    return (
        <motion.div
            key={skill.name}
            className="group relative flex size-[450px] flex-col justify-between gap-5 overflow-hidden rounded-xl border p-5 text-balance backdrop-blur-md"
            style={{
                background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(var(--primary-rgb), 0.15))",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.05)",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 40px 0 rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 },
            }}
        >
            <div className="pointer-events-none absolute -inset-1 -top-1/2 -left-1/2 h-[200%] w-[200%] rotate-[-10deg] bg-gradient-to-tr from-white/10 via-white/5 to-transparent opacity-30"></div>

            <div className="space-y-5">
                <motion.div
                    className="absolute top-0 right-0 h-20 w-20 rounded-full bg-primary/20 blur-xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-10 left-0 h-16 w-16 rounded-full bg-secondary/20 blur-xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        delay: 0.5,
                    }}
                />

                <motion.div
                    className="relative z-10 flex aspect-video items-center justify-center overflow-hidden rounded-md border bg-gradient-to-br from-gray-900 via-blue-950 to-yellow-950 shadow-md"
                    whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.3 },
                    }}
                >
                    <Image
                        src={skill.icon}
                        alt={skill.name}
                        className="size-32"
                        width={500}
                        height={500}
                    />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>

                <Separator />
            </div>

            <motion.div
                className="relative z-10 flex flex-col justify-end"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + 0.1 * index }}
            >
                <motion.h4
                    className="text-2xl font-semibold"
                    whileHover={{ scale: 1.03 }}
                >
                    {skill.name}
                </motion.h4>

                <div className="space-y-2">
                    <p className="text-foreground/70">{skill.description}</p>

                    <Link
                        href={skill.href}
                        className="group/link flex w-fit items-center gap-1 font-medium text-foreground/80 hover:text-foreground hover:underline"
                        target="_blank"
                    >
                        View Docs
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ width: 0, height: 0 }}
                            whileHover={{ width: 16, height: 16 }}
                        >
                            <path d="m9 18 6-6-6-6" />
                        </motion.svg>
                    </Link>
                </div>
            </motion.div>

            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: "url(/noise-light.png)",
                    backgroundSize: "200px 200px",
                }}
            />
        </motion.div>
    );
}

function GlobeRotation() {
    return (
        <div className="relative w-full">
            <motion.div
                className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-gradient-to-br from-foreground to-foreground/80 p-2 text-center shadow-lg"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                }}
                whileHover={{ scale: 1.1 }}
            >
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                >
                    <DRVGO width={50} height={50} />
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute top-1/2 left-1/2 -z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-xl"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "mirror",
                }}
            />

            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                <motion.div
                    className="relative size-32 rounded-full border md:size-40"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background p-2 shadow-md"
                        whileHover={{ scale: 1.2 }}
                    >
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                            alt="HTML"
                            width={30}
                            height={30}
                            className="drop-shadow-md"
                        />
                    </motion.div>
                    <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border bg-background p-2 shadow-md"
                        whileHover={{ scale: 1.2 }}
                    >
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                            alt="CSS"
                            width={30}
                            height={30}
                            className="drop-shadow-md"
                        />
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: -360 }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                <motion.div
                    className="relative size-52 rounded-full border md:size-64"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-foreground p-2 shadow-md"
                        whileHover={{ scale: 1.2 }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            <Image
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                                alt="React"
                                width={30}
                                height={30}
                                className="drop-shadow-md"
                            />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="absolute top-[calc(50%+50%*cos(60deg))] left-[calc(50%-50%*sin(60deg))] -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background p-2 shadow-md"
                        whileHover={{ scale: 1.2 }}
                    >
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                            alt="NextJS"
                            width={30}
                            height={30}
                            className="drop-shadow-md"
                        />
                    </motion.div>

                    <motion.div
                        className="absolute top-[calc(50%+50%*cos(60deg))] left-[calc(50%+50%*sin(60deg))] -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background p-1 shadow-md"
                        whileHover={{ scale: 1.2 }}
                    >
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
                            alt="MongoDB"
                            width={30}
                            height={30}
                            className="drop-shadow-md"
                        />
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                <motion.div
                    className="relative size-72 rounded-full border md:size-[22rem]"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background p-2 shadow-md"
                        whileHover={{ scale: 1.2 }}
                    >
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
                            alt="PostgreSQL"
                            width={30}
                            height={30}
                            className="drop-shadow-md"
                        />
                    </motion.div>

                    <motion.div
                        className="absolute top-[calc(50%+50%*cos(60deg))] left-[calc(50%-50%*sin(60deg))] -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background p-2 shadow-md"
                        whileHover={{ scale: 1.2 }}
                    >
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                            alt="NodeJS"
                            width={30}
                            height={30}
                            className="drop-shadow-md"
                        />
                    </motion.div>

                    <motion.div
                        className="absolute top-[calc(50%+50%*cos(60deg))] left-[calc(50%+50%*sin(60deg))] -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background p-2 shadow-md"
                        whileHover={{ scale: 1.2 }}
                    >
                        <Image
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                            alt="TypeScript"
                            width={30}
                            height={30}
                            className="drop-shadow-md"
                        />
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute top-1/2 left-1/2 -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 opacity-50"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/10 opacity-40"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -z-10 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10 opacity-30"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
            />
        </div>
    );
}
