"use client";

import { motion } from "motion/react";

export function BlogTitle() {
    return (
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
                My Blogs
            </motion.h1>

            <motion.p
                className="text-sm md:text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                I write about latest technologies, programming and more...
            </motion.p>
        </motion.div>
    );
}
