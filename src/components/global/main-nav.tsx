"use client";

import { MobileNav } from "@/src/components/global/mobile-nav";
import { Icons } from "@/src/components/icons/icons";
import { DRVGOIcon } from "@/src/config/const";
import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { DefaultProps, MainNavItem } from "@/src/types";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useState } from "react";

interface MainNavProps extends DefaultProps {
    items?: MainNavItem[];
}

function MainNav({ items, children, className }: MainNavProps) {
    const segment = useSelectedLayoutSegment();
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <div className={className}>
            <Link href="/" className="hidden items-center space-x-2 md:flex">
                <Image src={DRVGOIcon} alt="DRVGO" width={30} height={30} />
                <p className="hidden text-xl font-bold text-accent-foreground sm:inline-block">
                    {siteConfig.name}
                </p>
            </Link>
            {items?.length ? (
                <nav className="hidden gap-6 uppercase md:flex">
                    {items?.map((item, index) => (
                        <Link
                            key={index}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "hover:text-foreground/80 relative flex items-center gap-1 text-lg font-semibold transition-colors sm:text-sm",
                                item.href.startsWith(`/${segment}`)
                                    ? "text-foreground"
                                    : "text-foreground/60",
                                item.disabled && "cursor-not-allowed opacity-80"
                            )}
                        >
                            <p>{item.title}</p>
                            {item.title === "Blog" ? (
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                            ) : null}
                        </Link>
                    ))}
                </nav>
            ) : null}
            <button
                className="flex items-center space-x-2 md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
                {showMobileMenu ? (
                    <Icons.close />
                ) : (
                    <Image src={DRVGOIcon} alt="DRVGO" width={30} height={30} />
                )}
                <span className="font-bold">Menu</span>
            </button>
            {showMobileMenu && items && (
                <MobileNav items={items}>{children}</MobileNav>
            )}
        </div>
    );
}

export { MainNav };
