"use client";

import { menuConfig } from "@/src/config/menu";
import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import {
    Link,
    Navbar as Nav,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    NavbarProps,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icons } from "../../icons/icons";
import DRVGO from "../svgs/DRVGO";

function Navbar({ ...props }: NavbarProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Nav
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            shouldHideOnScroll
            classNames={{
                item: "font-semibold uppercase",
                base: cn(
                    "z-50 bg-transparent",
                    pathname === "/"
                        ? "pointer-events-none fixed z-50 bg-transparent px-0 pt-0 backdrop-blur-sm backdrop-saturate-100 md:px-5 md:pt-5 md:backdrop-blur-0"
                        : "z-50 border-b border-white/10 bg-transparent md:bg-default-50"
                ),
                wrapper:
                    pathname === "/"
                        ? "bg-transparent md:bg-default-100 rounded-none md:rounded-full pointer-events-auto"
                        : "max-w-4xl 2xl:max-w-6xl lg:px-0 px-4",
            }}
            {...props}
        >
            <NavbarContent justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        color="primary"
                    >
                        <DRVGO />
                        <h4 className="text-xl font-bold text-primary-700">
                            {siteConfig.name}
                        </h4>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                {menuConfig.length > 0
                    ? menuConfig.map((item, index) => (
                          <NavbarItem key={index}>
                              <Link
                                  className="text-sm"
                                  href={item.href}
                                  color="foreground"
                                  isExternal={item.isExternal}
                              >
                                  {item.title}
                              </Link>
                          </NavbarItem>
                      ))
                    : null}
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Link
                        href="/support"
                        className="group flex items-center gap-2 rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-black hover:opacity-100"
                    >
                        <Icons.discord className="size-4 transition-all ease-in-out group-hover:size-0" />
                        <p className="uppercase">Discord</p>
                        <Icons.arrowRight className="size-0 transition-all ease-in-out group-hover:size-4" />
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu className="z-50">
                {menuConfig.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            href={item.href}
                            size="lg"
                            color="foreground"
                            isExternal={item.isExternal}
                            onPress={() => setIsMenuOpen(false)}
                        >
                            {item.title}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Nav>
    );
}

export default Navbar;
