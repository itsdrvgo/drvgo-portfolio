import { slackey } from "@/app/fonts";
import { Footer, NavbarHome, NavbarMob } from "@/components/globals/layouts";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blogs",
    description: "Read about my thoughts and experiences",
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
