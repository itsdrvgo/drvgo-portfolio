import Auth from "@/src/components/global/auth";
import { SiteFooter } from "@/src/components/global/footer";
import { MainNav } from "@/src/components/global/main-nav";
import { homeMenuConfig } from "@/src/config/menu";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Home",
};

function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full bg-background">
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
            <main className="flex-1">{children}</main>
            <SiteFooter className="relative flex w-full flex-col items-center justify-center space-y-20 bg-secondary py-10" />
        </div>
    );
}

export default Layout;
