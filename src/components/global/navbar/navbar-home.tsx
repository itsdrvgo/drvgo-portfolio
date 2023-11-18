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
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import LoginButton from "../buttons/login-button";
import DRVGOLogo from "../svgs/DRVGOLogo";

function NavbarHome({ ...props }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar
            onMenuOpenChange={setIsMenuOpen}
            shouldHideOnScroll
            classNames={{
                item: "font-semibold uppercase",
                base:
                    pathname === "/"
                        ? "z-50 bg-transparent fixed backdrop-blur-sm md:backdrop-blur-0 backdrop-saturate-100 pt-0 md:pt-5 pointer-events-none px-0 md:px-5"
                        : "z-50 bg-transparent border-b border-border md:bg-default-50",
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
                                  href={item.href}
                              >
                                  {item.title}
                              </Link>
                          </NavbarItem>
                      ))
                    : null}
                <Dropdown
                    classNames={{
                        base: "bg-default-100",
                        trigger: "min-w-unit-1",
                    }}
                >
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
