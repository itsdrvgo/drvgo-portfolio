import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

/**
 * 5 placeholder images in a staggered orbit layout.
 * Swap src URLs with your own photos later.
 */
const gridImages = [
    {
        src: "https://6kyfi4ef87.ufs.sh/f/tgjx8p7aDhPeNGCnOrl4UDsSHEIjC7GZY9ABuaeVPkrbivNM",
        alt: "Photo 1",
        size: "size-28 md:size-36",
        position: "-top-4 -right-4 md:-top-6 md:-right-6",
        delay: 0,
        ring: "ring-4 ring-primary/20",
    },
    {
        src: "https://6kyfi4ef87.ufs.sh/f/tgjx8p7aDhPegIbVBASS7FPCR4yire1sU65vd2NQDhtX8aG9",
        alt: "Photo 2",
        size: "size-40 md:size-52",
        position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        delay: 0.1,
        ring: "ring-4 ring-secondary/30",
    },
    {
        src: "https://6kyfi4ef87.ufs.sh/f/tgjx8p7aDhPeC5fl7pwdnS1hBzdvf47Yb2lQVxWRNFAyoOjC",
        alt: "Photo 3",
        size: "size-24 md:size-28",
        position: "-bottom-2 -left-4 md:-bottom-4 md:-left-6",
        delay: 0.2,
        ring: "ring-4 ring-accent/25",
    },
    {
        src: "https://6kyfi4ef87.ufs.sh/f/tgjx8p7aDhPeYB5rZMmML1mWDteZKGwHQ58zAacUFl4T3O9C",
        alt: "Photo 4",
        size: "size-20 md:size-24",
        position: "-bottom-2 right-6 md:-bottom-4 md:right-8",
        delay: 0.3,
        ring: "ring-4 ring-primary/15",
    },
    {
        src: "https://6kyfi4ef87.ufs.sh/f/tgjx8p7aDhPe0eFdpXYKvtHDbnI8sgWRSAY7UuPwfcL5zpVh",
        alt: "Photo 5",
        size: "size-16 md:size-20",
        position: "top-4 -left-2 md:top-2 md:-left-4",
        delay: 0.15,
        ring: "ring-4 ring-secondary/20",
    },
];

const stats = [
    { label: "Projects", value: "20+" },
    { label: "Experience", value: "3+ yrs" },
    { label: "Tech Stack", value: "15+" },
];

export function About({ className, ...props }: GenericProps) {
    return (
        <section
            className={cn(
                "relative flex items-center justify-center overflow-hidden px-5 py-28 md:py-36",
                className
            )}
            {...props}
        >
            <div className="flex w-full max-w-6xl flex-col items-center gap-16 lg:flex-row lg:gap-20">
                {/* Image constellation */}
                <motion.div
                    className="relative flex size-72 shrink-0 items-center justify-center md:size-[360px]"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Subtle connecting lines */}
                    <svg
                        className="absolute inset-0 size-full opacity-[0.08]"
                        viewBox="0 0 360 360"
                        fill="none"
                    >
                        <line
                            x1="280"
                            y1="60"
                            x2="180"
                            y2="180"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                        <line
                            x1="180"
                            y1="180"
                            x2="60"
                            y2="300"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                        <line
                            x1="180"
                            y1="180"
                            x2="250"
                            y2="310"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                        <line
                            x1="60"
                            y1="80"
                            x2="180"
                            y2="180"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </svg>

                    {gridImages.map((img) => (
                        <motion.div
                            key={img.alt}
                            className={cn(
                                "absolute overflow-hidden rounded-full shadow-lg",
                                img.size,
                                img.position,
                                img.ring
                            )}
                            initial={{ opacity: 0, scale: 0.6 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 14,
                                delay: 0.3 + img.delay,
                            }}
                            whileHover={{
                                scale: 1.12,
                                zIndex: 10,
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15,
                                },
                            }}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) 50vw, 20vw"
                                className="object-cover"
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Text side */}
                <div className="flex flex-col gap-6 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="mb-2 text-sm font-medium tracking-widest text-primary uppercase">
                            About Me
                        </p>
                        <h2 className="text-gradient text-4xl font-bold md:text-5xl">
                            Sarthak Kundu
                        </h2>
                        <p className="mt-1 text-lg text-muted-foreground">
                            Full Stack Developer
                        </p>
                    </motion.div>

                    <motion.div
                        className="space-y-4 text-muted-foreground md:text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <p>
                            A dedicated full-stack developer, crafting seamless
                            web solutions for the modern world, with expertise
                            in Next.JS, React & more.
                        </p>
                        <p>
                            Always eager to learn new technologies. Focused on
                            the back-end side of things, with a strong
                            understanding of front-end technologies. A quick
                            learner & a team player.
                        </p>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div
                        className="flex justify-center gap-8 lg:justify-start"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.5 + i * 0.1,
                                    duration: 0.5,
                                }}
                            >
                                <p className="text-gradient text-2xl font-bold md:text-3xl">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        className="flex justify-center gap-4 lg:justify-start"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/cv"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                            >
                                Download CV
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
