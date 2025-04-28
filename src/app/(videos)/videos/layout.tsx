import { Footer, Navbar, NavbarMob } from "@/components/globals/layouts";
import { SLACKEY_FONT } from "@/config/fonts";
import { cn } from "@/lib/utils";
import { LayoutProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Videos",
    description: "Watch videos on web development",
};

function Layout({ children }: LayoutProps) {
    return (
        <div
            className={cn(
                SLACKEY_FONT.className,
                "relative flex min-h-screen flex-col"
            )}
        >
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <NavbarMob />
        </div>
    );
}

export default Layout;
