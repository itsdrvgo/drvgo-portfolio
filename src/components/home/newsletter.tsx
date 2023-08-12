"use client";

import { DefaultProps } from "@/src/types";
import { motion, Variants } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

function Newsletter({ className }: DefaultProps) {
    const { toast } = useToast();

    const handleNewsLetter = () => {
        toast({
            title: "Oops!",
            description: "This feature is not available yet!",
            variant: "destructive",
        });
    };

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
                className="container flex max-w-[75rem] flex-col items-center justify-center gap-10 p-0"
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
                    className="w-full space-y-3 rounded-md bg-gradient-to-r from-accent via-card to-secondary p-5 md:p-10"
                    variants={fadeInContainer}
                >
                    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-5">
                        <Input className="h-9" />
                        <Button
                            variant={"destructive"}
                            className="uppercase"
                            size={"sm"}
                            onClick={handleNewsLetter}
                        >
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
