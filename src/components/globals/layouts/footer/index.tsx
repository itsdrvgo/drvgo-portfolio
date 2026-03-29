"use client";

import { DRVGO } from "@/components/globals/svgs";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";

export function Footer({ className, ...props }: GenericProps) {
    return (
        <footer
            className={cn(
                "relative flex w-full flex-col items-center gap-12 border-t px-5 py-16",
                className
            )}
            {...props}
        >
            {/* Brand */}
            <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <DRVGO width={48} height={48} className="text-[#5b9fd6]" />
                <h3 className="text-gradient text-3xl font-bold">DRVGO</h3>
                <p className="max-w-xs text-center text-sm text-muted-foreground">
                    Learning, Coding & Bringing the best out of me.
                </p>
            </motion.div>

            {/* Social links */}
            {siteConfig.links && (
                <motion.div
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {Object.entries(siteConfig.links).map(([key, value], i) => {
                        const Icon = Icons[key as keyof typeof Icons];

                        return (
                            <motion.div
                                key={i}
                                whileHover={{ y: -3, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15,
                                }}
                            >
                                <Link
                                    href={value}
                                    className="flex size-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                                    target="_blank"
                                >
                                    <Icon className="size-4" />
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* Copyright */}
            <motion.p
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                &copy; {new Date().getFullYear()}{" "}
                <Link
                    href="/"
                    className="font-medium text-primary hover:underline"
                >
                    DRVGO
                </Link>
                . All rights reserved.
            </motion.p>
        </footer>
    );
}
