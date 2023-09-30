import { DefaultProps } from "@/src/types";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

function Newsletter({ className }: DefaultProps) {
    const [value, setValue] = useState("");

    const handleNewsLetter = () => {
        toast.error("This feature is not yet available!");
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

                <motion.div variants={fadeInContainer} className="w-full">
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
                                    radius="sm"
                                />

                                <Button
                                    radius="sm"
                                    color="primary"
                                    onClick={handleNewsLetter}
                                >
                                    Subscribe
                                </Button>
                            </div>
                            <p className="text-xs text-gray-400 md:text-sm">
                                We&apos;ll be sending you updates about our
                                latest projects, opportunities, and more.
                            </p>
                        </CardBody>
                    </Card>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}

export default Newsletter;
