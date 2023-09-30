"use client";

import { Icons } from "@/src/components/icons/icons";
import { homeMenuConfig as items } from "@/src/config/menu";
import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    NavbarProps,
} from "@nextui-org/react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import LoginButton from "../buttons/login-button";
import DRVGOLogo from "../DRVGOLogo";

function NavbarHome({ ...props }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar
            maxWidth="2xl"
            onMenuOpenChange={setIsMenuOpen}
            shouldHideOnScroll
            classNames={{
                item: "font-semibold uppercase",
                base:
                    "top-0 z-50 bg-transparent " +
                    (pathname === "/" ? "fixed" : "sticky"),
            }}
            {...props}
        >
            <NavbarContent justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <button
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => router.push("/")}
                    >
                        <DRVGOLogo />
                        <p className="text-xl font-bold text-accent">
                            {siteConfig.name}
                        </p>
                    </button>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                {items.mainNav.length > 0
                    ? items.mainNav.map((item, index) => (
                          <NavbarItem key={index} className="text-sm">
                              <Link
                                  className="text-sm text-text"
                                  as={NextLink}
                                  href={item.href}
                              >
                                  {item.title}
                              </Link>
                          </NavbarItem>
                      ))
                    : null}
                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="bg-transparent p-0 text-sm font-semibold uppercase data-[hover=true]:bg-transparent"
                                endContent={
                                    <Icons.chevronDown className="h-4 w-4" />
                                }
                                radius="sm"
                                variant="light"
                            >
                                More
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>

                    <DropdownMenu
                        aria-label="More"
                        className="w-[280px]"
                        itemClasses={{
                            base: "gap-4",
                            title: "font-semibold",
                        }}
                    >
                        {items.subNav.map((item, index) => {
                            const iconColors = [
                                "text-orange-500",
                                "text-blue-500",
                                "text-warning",
                                "text-danger",
                                "text-success",
                                "text-sky-500",
                            ];

                            const Icon = Icons[item.icon!];

                            return (
                                <DropdownItem
                                    key={item.title.replace(" ", "-")}
                                    description={item.description}
                                    startContent={
                                        <Icon
                                            className={cn(
                                                "h-4 w-4",
                                                iconColors[index]
                                            )}
                                        />
                                    }
                                    onPress={() => router.push(item.href)}
                                >
                                    {item.title}
                                </DropdownItem>
                            );
                        })}
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <LoginButton />
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu className="z-50">
                {items.mainNav.map((item, index) => (
                    <NavbarMenuItem
                        key={`${item}-${index}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Link
                            as={NextLink}
                            className="w-full text-text"
                            href={item.href}
                            size="lg"
                        >
                            {item.title}
                        </Link>
                    </NavbarMenuItem>
                ))}

                {items.subNav.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            as={NextLink}
                            className="w-full text-text"
                            href={item.href}
                            size="lg"
                        >
                            {item.title}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}

export default NavbarHome;
