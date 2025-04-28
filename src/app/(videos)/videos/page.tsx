"use client";

import { VideoCards, VideoCarousel } from "@/components/videos";
import { programmingVideos } from "@/config/video";
import { motion } from "motion/react";

function Page() {
    return (
        <motion.section
            className="flex min-h-screen justify-center p-5 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full max-w-4xl space-y-8 2xl:max-w-6xl">
                <motion.div
                    className="space-y-2 text-center md:text-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <motion.h1
                        className="text-4xl font-bold md:text-5xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        My Videos
                    </motion.h1>
                    <motion.p
                        className="text-sm md:text-base"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        I make videos on programming
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    <VideoCards
                        videos={programmingVideos}
                        className="md:hidden"
                    />

                    <VideoCarousel
                        videos={programmingVideos}
                        options={{
                            loop: true,
                        }}
                        className="hidden md:block"
                    />
                </motion.div>
            </div>
        </motion.section>
    );
}

export default Page;
