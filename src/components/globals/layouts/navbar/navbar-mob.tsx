"use client";

import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { useNavbarStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function NavbarMob({ className }: GenericProps) {
    const isMenuOpen = useNavbarStore((state) => state.isOpen);
    const setIsMenuOpen = useNavbarStore((state) => state.setIsOpen);

    const navContainerRef = useRef<HTMLDivElement | null>(null);
    const navListRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (typeof document === "undefined") return;

        if (isMenuOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isMenuOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                navContainerRef.current?.contains(event.target as Node) &&
                !navListRef.current?.contains(event.target as Node)
            )
                setIsMenuOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsMenuOpen]);

    return (
        <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    aria-label="Mobile Menu"
                    className={cn(
                        "fixed inset-0 z-40 flex items-start justify-center bg-black/40 p-4 pt-20 backdrop-blur-sm md:hidden",
                        className
                    )}
                    ref={navContainerRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="glass w-full max-w-sm overflow-hidden rounded-2xl p-2 shadow-2xl"
                        ref={navListRef}
                        initial={{ y: -20, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: -20, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}
                    >
                        {siteConfig.menu.map((item, index) => {
                            const Icon = Icons[item.icon ?? "add"];

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: 0.05 * index,
                                        duration: 0.3,
                                    }}
                                >
                                    <Link
                                        href={item.href}
                                        className="flex items-center justify-between gap-2 rounded-xl px-4 py-4 text-foreground transition-colors hover:bg-muted"
                                        target={
                                            item.isExternal ? "_blank" : "_self"
                                        }
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="font-medium">
                                            {item.name}
                                        </span>
                                        <Icon className="size-4 text-muted-foreground" />
                                    </Link>
                                </motion.div>
                            );
                        })}

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: 0.05 * siteConfig.menu.length,
                                duration: 0.3,
                            }}
                            className="p-2 pt-1"
                        >
                            <Link
                                href={siteConfig.links!.Discord!}
                                target="_blank"
                                className="flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                            >
                                <Icons.Discord className="size-4" />
                                Join Discord
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
