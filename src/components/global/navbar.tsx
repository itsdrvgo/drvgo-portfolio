import { homeMenuConfig } from "@/src/config/menu";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import Auth from "./auth";
import { MainNav } from "./main-nav";

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
                    items={homeMenuConfig.mainNav}
                    className="flex gap-6 md:gap-10"
                />
                <nav>
                    <Auth />
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
