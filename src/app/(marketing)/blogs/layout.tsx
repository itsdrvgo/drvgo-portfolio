import { Footer, Navbar, NavbarMob } from "@/components/globals/layouts";
import { SLACKEY_FONT } from "@/config/fonts";
import { LayoutProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blogs",
    description: "Read blogs I write about latest technologies",
};

function Layout({ children }: LayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Navbar className={SLACKEY_FONT.className} />
            <main className="flex-1">{children}</main>
            <Footer className={SLACKEY_FONT.className} />
            <NavbarMob className={SLACKEY_FONT.className} />
        </div>
    );
}

export default Layout;
