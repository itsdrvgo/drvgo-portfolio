"use client";

import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { useNavbarStore } from "@/lib/store/navbar";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DRVGO } from "../../svgs";

export function NavbarHome() {
    const pathname = usePathname();

    const [isMenuHidden, setIsMenuHidden] = useState(false);

    const isMenuOpen = useNavbarStore((state) => state.isOpen);
    const setIsMenuOpen = useNavbarStore((state) => state.setIsOpen);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        if (latest > previous && latest > 150) setIsMenuHidden(true);
        else setIsMenuHidden(false);
    });

    return (
        <motion.header
            variants={{
                visible: {
                    y: 0,
                },
                hidden: {
                    y: "-100%",
                },
            }}
            animate={isMenuHidden ? "hidden" : "visible"}
            transition={{
                duration: 0.35,
                ease: "easeInOut",
            }}
            className={cn(
                "fixed inset-x-0 top-0 z-50 flex h-auto w-full items-center justify-center p-4 px-3",
                pathname !== "/" && "sticky"
            )}
            data-menu-open={isMenuOpen}
        >
            <nav className="relative z-10 flex w-full max-w-4xl items-center justify-between gap-5 overflow-hidden rounded-full border bg-background p-4 shadow-md md:p-0">
                <div className="flex items-center gap-1 md:hidden">
                    <DRVGO isDark />
                    <h2 className="text-xl">DRVGO</h2>
                </div>

                <button
                    className="rounded-full bg-foreground p-1 text-background md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Icons.ChevronLeft
                        className={cn(
                            "transition-all ease-in-out",
                            isMenuOpen && "-rotate-90"
                        )}
                    />
                </button>

                <div className="hidden items-center gap-5 p-8 px-10 md:flex">
                    {siteConfig.menu.map((item, index) => (
                        <Link
                            className="text-2xl font-bold uppercase"
                            href={item.href}
                            target={item.isExternal ? "_blank" : "_self"}
                            key={index}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden border-l bg-accent p-6 px-8 md:inline-block">
                    <Link href="/support">
                        <div className="rounded-full bg-black p-2">
                            <Icons.Discord className="size-8 text-white" />
                        </div>
                    </Link>
                </div>
            </nav>
        </motion.header>
    );
}
