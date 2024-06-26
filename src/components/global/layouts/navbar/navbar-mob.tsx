"use client";

import { Icons } from "@/components/icons";
import { menu } from "@/config/menu";
import { siteConfig } from "@/config/site";
import { useNavbarStore } from "@/lib/store/navbar";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import Link from "next/link";
import { ElementRef, useEffect, useRef } from "react";

export function NavbarMob({ className, ...props }: GenericProps) {
    const isMenuOpen = useNavbarStore((state) => state.isOpen);
    const setIsMenuOpen = useNavbarStore((state) => state.setIsOpen);

    const navContainerRef = useRef<ElementRef<"div"> | null>(null);
    const navListRef = useRef<ElementRef<"ul"> | null>(null);

    useEffect(() => {
        if (typeof document === "undefined") return;

        if (isMenuOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isMenuOpen]);

    // if navContainer is clicked but not navList, close the menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                navContainerRef.current?.contains(event.target as Node) &&
                !navListRef.current?.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsMenuOpen]);

    return (
        <div
            aria-label="Mobile Menu"
            data-menu-open={isMenuOpen}
            className={cn(
                "fixed inset-x-0 z-40",
                "overflow-hidden p-4",
                "transition-all duration-500 ease-in-out",
                "h-0 data-[menu-open=true]:h-screen",
                "-top-1/2 bottom-0 data-[menu-open=true]:top-0",
                "md:hidden",
                className
            )}
            ref={navContainerRef}
            {...props}
        >
            <ul
                className="mt-20 rounded-xl border bg-background px-4 py-3 drop-shadow-md"
                ref={navListRef}
            >
                {menu.map((item, index) => {
                    const Icon = Icons[item.icon ?? "add"];

                    return (
                        <li
                            key={index}
                            className="border-b border-foreground/20"
                            aria-label="Mobile Menu Item"
                        >
                            <Link
                                href={item.href}
                                className="flex items-center justify-between gap-2 px-2 py-5 text-foreground"
                                target={item.isExternal ? "_blank" : "_self"}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span>{item.title}</span>
                                <Icon className="size-5" />
                            </Link>
                        </li>
                    );
                })}

                <Link
                    href={siteConfig.links?.discord!}
                    target="_blank"
                    className="my-5 flex items-center justify-between gap-4 rounded-full bg-primary p-3 px-6 text-primary-foreground"
                >
                    <p>Join our Server</p>
                    <Icons.discord className="size-5" />
                </Link>
            </ul>
        </div>
    );
}
