"use client";

import { DRVGO } from "@/components/globals/svgs";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { useNavbarStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function NavbarHome({ className }: GenericProps) {
    const pathname = usePathname();

    const [isMenuHidden, setIsMenuHidden] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    const isMenuOpen = useNavbarStore((state) => state.isOpen);
    const setIsMenuOpen = useNavbarStore((state) => state.setIsOpen);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        setHasScrolled(latest > 50);

        if (latest > previous && latest > 150) setIsMenuHidden(true);
        else setIsMenuHidden(false);
    });

    return (
        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-120%" },
            }}
            animate={isMenuHidden ? "hidden" : "visible"}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
            className={cn(
                "fixed inset-x-0 top-0 z-50 flex w-full items-center justify-center p-4",
                pathname !== "/" && "sticky",
                className
            )}
            data-menu-open={isMenuOpen}
        >
            <motion.nav
                className={cn(
                    "relative z-10 flex w-full max-w-2xl items-center justify-between rounded-full px-2 py-2 transition-all duration-300",
                    hasScrolled ? "glass shadow-lg" : "bg-transparent"
                )}
                layout
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 pl-3">
                    <motion.div
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                    >
                        <DRVGO
                            width={26}
                            height={26}
                            className="text-[#5b9fd6]"
                        />
                        <span className="text-gradient text-lg font-bold">
                            DRVGO
                        </span>
                    </motion.div>
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-1 md:flex">
                    {siteConfig.menu.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                target={item.isExternal ? "_blank" : "_self"}
                                className={cn(
                                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {isActive && (
                                    <motion.span
                                        className="absolute inset-0 rounded-full bg-muted"
                                        layoutId="navIndicator"
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25,
                                        }}
                                    />
                                )}
                                <span className="relative z-10">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Discord CTA */}
                <motion.div
                    className="hidden md:block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        href="/support"
                        className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                    >
                        <Icons.Discord className="size-4" />
                        Discord
                    </Link>
                </motion.div>

                {/* Mobile menu toggle */}
                <button
                    className="flex size-9 items-center justify-center rounded-full bg-foreground text-background md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <motion.div
                        animate={{ rotate: isMenuOpen ? 90 : 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                        }}
                    >
                        {isMenuOpen ? (
                            <Icons.X className="size-4" />
                        ) : (
                            <Icons.ChevronLeft className="size-4 rotate-180" />
                        )}
                    </motion.div>
                </button>
            </motion.nav>
        </motion.header>
    );
}
