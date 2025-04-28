import { Footer, NavbarHome, NavbarMob } from "@/components/globals/layouts";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { slackey } from "../fonts";

export const metadata: Metadata = {
    title: {
        default: siteConfig.description + " - " + siteConfig.name,
        template: "%s - " + siteConfig.name,
    },
};

export default function Layout({ children }: LayoutProps) {
    return (
        <div
            className={cn(
                "relative flex min-h-screen flex-col",
                slackey.className
            )}
        >
            <NavbarHome />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
            <NavbarMob />
        </div>
    );
}
