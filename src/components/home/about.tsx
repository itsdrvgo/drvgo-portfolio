import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export function About({ className, ...props }: GenericProps) {
    return (
        <section
            className={cn("flex min-h-screen flex-col items-center", className)}
            {...props}
        >
            <div className="flex w-full justify-center bg-foreground p-5 py-10 md:py-14">
                <motion.h2
                    className="text-4xl font-semibold text-background md:text-7xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Who Am I?
                </motion.h2>
            </div>

            <div className="flex flex-1 justify-center p-5 py-16 md:py-28">
                <div className="flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-10 lg:flex-row">
                    <motion.div
                        className="space-y-4 md:basis-1/2 md:space-y-8"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <motion.h3
                                className="text-3xl font-semibold md:text-5xl"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                Sarthak Kundu
                            </motion.h3>
                            <motion.p
                                className="text-xl text-muted-foreground md:text-2xl"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                Full Stack Developer
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="space-y-4 text-base md:text-lg"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.7 }}
                        >
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                            >
                                A dedicated full-stack developer, thriving to
                                craft seamless web solutions for the modern
                                world, with expertise in Next.JS, React & more.
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                Always eager to learn new technologies and tools
                                to enhance my skills and knowledge. More focused
                                on the back-end side of things, but also have a
                                good understanding of front-end technologies. A
                                quick learner & a team player, always ready to
                                go the extra mile.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                        >
                            <Button
                                asChild
                                className="rounded-full border p-5 py-6 text-lg transition-transform hover:scale-105 md:p-6 md:py-7 md:text-xl"
                            >
                                <Link
                                    href="/cv"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download CV
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="pointer-events-none flex items-center justify-center md:basis-1/2 md:justify-end"
                        initial={{ opacity: 0, x: 30, scale: 0.9 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src="https://6kyfi4ef87.ufs.sh/f/tgjx8p7aDhPebMUomgUrQCwfcRyvk6Vs1No34xYu5Pa8gIEd"
                                alt="About Grid"
                                width={500}
                                height={500}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
