"use client";

import { homeMenuConfig } from "@/src/config/menu";
import { cn } from "@/src/lib/utils";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { Notification } from "@/src/types/notification";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Suspense, useState } from "react";
import { Icons } from "../icons/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Auth from "./auth";
import LoginButton from "./login-button";
import { MainNav } from "./main-nav";
import NotificationBar from "./notification-bar";

interface PageProps extends DefaultProps {
    user: ClerkUser;
    notifications: Notification[];
}

function NavbarItems({ className, user, notifications }: PageProps) {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        latest > previous && latest > 100 ? setHidden(true) : setHidden(false);
    });

    return (
        <motion.header
            variants={{
                hidden: {
                    y: "-100%",
                },
                visible: {
                    y: 0,
                },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{
                duration: 0.35,
                ease: "easeInOut",
            }}
            className={cn(
                "sticky top-0 z-40 w-full border-b border-border bg-transparent backdrop-blur-sm",
                className
            )}
        >
            <div className="container flex h-20 items-center justify-between py-6">
                <MainNav
                    items={homeMenuConfig}
                    className="flex gap-6 md:gap-10"
                />
                <nav className="flex items-center gap-5">
                    <Suspense
                        fallback={
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="cursor-pointer rounded-md border border-gray-700 p-2 text-sky-400">
                                        <Icons.notification className="h-4 w-4" />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="text-center">
                                    <p>
                                        No notifications yet. Check back later
                                    </p>
                                </PopoverContent>
                            </Popover>
                        }
                    >
                        <NotificationBar user={user} data={notifications} />
                    </Suspense>

                    <Suspense fallback={<LoginButton />}>
                        <Auth user={user} />
                    </Suspense>
                </nav>
            </div>
        </motion.header>
    );
}

export default NavbarItems;
