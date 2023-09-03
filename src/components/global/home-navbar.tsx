import { homeMenuConfig } from "@/src/config/menu";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import LoginButton from "./login-button";
import { MainNav } from "./main-nav";

function HomeNavbar({ className }: DefaultProps) {
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
                <nav>
                    <LoginButton className="flex items-center gap-2 px-4" />
                </nav>
            </div>
        </header>
    );
}

export default HomeNavbar;
