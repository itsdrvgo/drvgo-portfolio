"use client";

import { Icons } from "@/src/components/icons/icons";
import { homeMenuConfig as items } from "@/src/config/menu";
import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedNotification } from "@/src/types";
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
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Auth from "./auth";
import DRVGOLogo from "./DRVGOLogo";

interface PageProps extends DefaultProps {
    user: ClerkUser;
    notifications: ExtendedNotification[];
}

function NavDashItems({ notifications, user }: PageProps) {
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar
            maxWidth="2xl"
            onMenuOpenChange={setIsMenuOpen}
            shouldHideOnScroll
            classNames={{
                item: "font-semibold uppercase",
                base: "z-50 bg-transparent border-b border-border",
            }}
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
                        <p className="text-xl font-bold text-accent-foreground">
                            {siteConfig.name}
                        </p>
                    </button>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                {items.mainNav.length > 0
                    ? items.mainNav.map((item, index) => (
                          <NavbarItem key={index} className="text-sm">
                              <Link className="text-sm" href={item.href}>
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
                            base: "gap-4 rounded-sm",
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
                                    onClick={() => router.push(item.href)}
                                >
                                    {item.title}
                                </DropdownItem>
                            );
                        })}
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>

            <NavbarContent justify="end" className="gap-6">
                <Auth user={user} notifications={notifications} />
            </NavbarContent>

            <NavbarMenu className="z-50">
                {items.mainNav.map((item, index) => (
                    <NavbarMenuItem
                        key={`${item}-${index}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Link
                            color={"primary"}
                            className="w-full"
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
                            color={"primary"}
                            className="w-full"
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

export default NavDashItems;