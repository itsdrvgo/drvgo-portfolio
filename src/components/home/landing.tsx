import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function Landing({ className, ...props }: GenericProps) {
    const letters = "DRVGO".split("");

    return (
        <section
            className={cn(
                "relative flex h-full min-h-screen items-center justify-center overflow-hidden p-5 md:p-0",
                className
            )}
            style={{
                backgroundImage: "url(/noise-light.png)",
            }}
            {...props}
        >
            <motion.div
                className="z-10 flex flex-col items-center gap-5 md:gap-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="flex text-6xl font-semibold md:text-[12rem]">
                    {letters.map((letter, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.1 * index,
                                ease: "easeOut",
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </h1>

                <motion.p
                    className="max-w-3xl text-center text-base md:-translate-y-2 md:text-2xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    A dedicated full-stack developer, passionate about crafting
                    seamless web solutions, with the expertise in Next.JS, React
                    & more... :D
                </motion.p>
            </motion.div>

            <motion.div
                className="absolute right-32 bottom-32 size-96 rounded-full bg-primary/30 opacity-50 blur-3xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 0.5 }}
                transition={{
                    scale: {
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    },
                    opacity: { duration: 1.5 },
                }}
            />
            <motion.div
                className="absolute top-12 left-28 size-[42rem] rounded-full bg-primary/30 opacity-50 blur-3xl"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 1.05, opacity: 0.5 }}
                transition={{
                    scale: {
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.5,
                    },
                    opacity: { duration: 1.5, delay: 0.2 },
                }}
            />
            <motion.div
                className="absolute top-44 left-64 size-56 rounded-full bg-secondary/60 blur-3xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                transition={{
                    scale: {
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 1,
                    },
                    opacity: { duration: 1.5, delay: 0.4 },
                }}
            />
        </section>
    );
}
