"use client";

import { MobileNav } from "@/src/components/global/mobile-nav";
import { Icons } from "@/src/components/icons/icons";
import { DRVGOIcon } from "@/src/config/const";
import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { DefaultProps, MenuConfig } from "@/src/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

interface MainNavProps extends DefaultProps {
    items: MenuConfig;
}

function MainNav({ items, children, className }: MainNavProps) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div className={className}>
            <Link href="/" className="hidden items-center space-x-2 md:flex">
                <Image src={DRVGOIcon} alt="DRVGO" width={30} height={30} />
                <p className="hidden text-xl font-bold text-accent-foreground sm:inline-block">
                    {siteConfig.name}
                </p>
            </Link>

            {items.mainNav.length ? (
                <nav className="hidden cursor-pointer gap-6 uppercase md:flex">
                    {items.mainNav.map((item, index) => (
                        <Link
                            key={index}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "relative flex items-center gap-1 text-lg font-semibold text-foreground transition-colors hover:text-gray-300 sm:text-sm",
                                item.disabled && "cursor-not-allowed opacity-80"
                            )}
                        >
                            <p>{item.title}</p>
                        </Link>
                    ))}

                    <Popover open={isHovering}>
                        <PopoverTrigger asChild>
                            <div
                                className="group flex items-center gap-1 text-lg font-semibold text-foreground transition-colors hover:text-gray-300 sm:text-sm"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <p>More</p>
                                <Icons.chevronDown className="h-4 w-4 transition-all ease-in-out group-hover:rotate-180" />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            sideOffset={0}
                            className="w-40 bg-white/10 backdrop-blur-sm"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <div className="flex flex-col gap-2 text-sm">
                                {items.subNav
                                    .filter(
                                        (item) =>
                                            !["/privacy", "/tos"].includes(
                                                item.href
                                            )
                                    )
                                    .map((item, index) => (
                                        <Link
                                            key={index}
                                            href={
                                                item.disabled ? "#" : item.href
                                            }
                                            className={cn(
                                                "flex items-center gap-1 rounded-sm p-1 px-2 text-lg font-semibold text-foreground transition-colors ease-in-out hover:bg-accent-foreground hover:text-background hover:backdrop-blur-sm sm:text-sm",
                                                item.disabled &&
                                                    "cursor-not-allowed opacity-80"
                                            )}
                                        >
                                            <p>{item.title}</p>
                                        </Link>
                                    ))}
                                <Separator />
                                {items.subNav
                                    .filter((item) =>
                                        ["/privacy", "/tos"].includes(item.href)
                                    )
                                    .map((item, index) => (
                                        <Link
                                            key={index}
                                            href={
                                                item.disabled ? "#" : item.href
                                            }
                                            className={cn(
                                                "flex items-center gap-1 rounded-sm p-1 px-2 text-lg font-semibold text-foreground transition-colors ease-in-out hover:bg-accent-foreground hover:text-background hover:backdrop-blur-sm sm:text-sm",
                                                item.disabled &&
                                                    "cursor-not-allowed opacity-80"
                                            )}
                                        >
                                            <p>{item.title}</p>
                                        </Link>
                                    ))}
                            </div>
                        </PopoverContent>
                    </Popover>
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
