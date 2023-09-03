import { homeMenuConfig } from "@/src/config/menu";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Suspense } from "react";
import { Icons } from "../icons/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Auth from "./auth";
import LoginButton from "./login-button";
import { MainNav } from "./main-nav";
import NotificationBar from "./notification-bar";

function Navbar({ className }: DefaultProps) {
    return (
        <header
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
                        <NotificationBar />
                    </Suspense>

                    <Suspense fallback={<LoginButton />}>
                        <Auth />
                    </Suspense>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
