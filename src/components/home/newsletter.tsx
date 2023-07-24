"use client";

import { DefaultProps } from "@/src/types";
import { motion, Variants } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function Newsletter({ className }: DefaultProps) {
    const fadeInContainer: Variants = {
        hide: {
            opacity: 0,
            y: 100,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2,
                duration: 0.5,
            },
        },
    };

    return (
        <motion.section
            className={className}
            variants={fadeInContainer}
            initial="hide"
            whileInView={"show"}
            viewport={{ once: true }}
            id="newsletter"
        >
            <motion.div
                className="container flex max-w-[75rem] flex-col items-center justify-center gap-10"
                variants={fadeInContainer}
            >
                <div className="flex flex-col items-center gap-5 text-center">
                    <p className="text-4xl font-bold md:text-5xl">
                        Subscribe to Newsletter
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Subscribe to our Newsletter to receive updates about our
                        latest projects.
                    </p>
                </div>

                <motion.div
                    className="w-full space-y-3 rounded-md bg-secondary p-5 md:p-10"
                    variants={fadeInContainer}
                >
                    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-5">
                        <Input />
                        <Button className="bg-red-900 uppercase text-white hover:bg-red-800">
                            Subscribe
                        </Button>
                    </div>
                    <p className="text-xs text-gray-400 md:text-sm">
                        We&apos;ll be sending you updates about our latest
                        projects, opportunities, and more.
                    </p>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}

export default Newsletter;
