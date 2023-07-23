"use client";

import { DefaultProps } from "@/src/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Variants, motion } from "framer-motion";

function Newsletter({ className }: DefaultProps) {
    const fadeInContainer: Variants = {
        hide: {
            opacity: 0,
            y: 100
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2,
                duration: 0.5
            }
        }
    }

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
                className="container flex flex-col gap-10 justify-center items-center max-w-[75rem]"
                variants={fadeInContainer}
            >
                <div className="flex flex-col items-center gap-5 text-center">
                    <p className="text-4xl md:text-5xl font-bold">Subscribe to Newsletter</p>
                    <p className="text-gray-400 text-sm md:text-base">Subscribe to our Newsletter to receive updates about our latest projects.</p>
                </div>

                <motion.div
                    className="bg-secondary rounded-md space-y-3 p-5 md:p-10 w-full"
                    variants={fadeInContainer}
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-5">
                        <Input />
                        <Button
                            className="uppercase hover:bg-red-800 bg-red-900 text-white"
                        >
                            Subscribe
                        </Button>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm">We&apos;ll be sending you updates about our latest projects, opportunities, and more.</p>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}

export default Newsletter;