"use client";

import { DefaultProps } from "@/src/types";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { Sparkle } from "../global/svgs/Sparkle";

function Newsletter({ className }: DefaultProps) {
    const [value, setValue] = useState("");

    const handleNewsLetter = () => {
        toast.error("This feature is not yet available!");
    };

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
        <section className={className} id="newsletter">
            <motion.div
                className="container flex max-w-4xl flex-col items-center justify-center gap-10 p-0"
                variants={slideUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                <motion.div className="space-y-2 text-center" variants={fadeIn}>
                    <p className="cursor-default text-4xl font-bold md:text-5xl">
                        Newsletter
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Subscribe to our Newsletter to receive updates about our
                        latest projects.
                    </p>
                </motion.div>

                <motion.div variants={fadeIn} className="w-full">
                    <Card>
                        <CardBody className="gap-4 p-6 md:p-10 md:px-8">
                            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-5">
                                <Input
                                    isClearable
                                    variant="underlined"
                                    className="w-full"
                                    placeholder="ryomensukuna@jjk.jp"
                                    value={value}
                                    onClear={() => setValue("")}
                                    onValueChange={setValue}
                                />

                                <Button
                                    radius="full"
                                    color="primary"
                                    className="bg-primary-200"
                                    onClick={handleNewsLetter}
                                >
                                    Subscribe
                                </Button>
                            </div>

                            <p className="cursor-default text-xs text-gray-400 md:text-sm">
                                We&apos;ll be sending you updates about our
                                latest projects, opportunities, and more.
                            </p>
                        </CardBody>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
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
                <Sparkle className="spark-spin-1 absolute left-[10%] top-[10%]" />
                <Sparkle className="spark-spin-2 absolute left-[20%] top-[40%]" />
                <Sparkle className="spark-spin-3 absolute right-[20%] top-[80%]" />
                <Sparkle className="spark-spin-2 absolute right-[10%] top-[20%]" />
            </motion.div>
        </section>
    );
}

export default Newsletter;
