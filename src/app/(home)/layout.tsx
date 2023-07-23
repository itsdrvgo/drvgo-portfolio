import { homeMenuConfig } from "@/src/config/menu";
import { MainNav } from "@/src/components/global/main-nav";
import { SiteFooter } from "@/src/components/global/footer";
import { ReactNode, Suspense } from "react";
import { Metadata } from "next";
import Auth from "@/src/components/global/auth";

export const metadata: Metadata = {
    title: "Home"
};

function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="z-40 bg-background sticky top-0 w-full">
                <div className="flex h-20 items-center justify-between py-6 container">
                    <MainNav items={homeMenuConfig.mainNav} className="flex gap-6 md:gap-10" />
                    <nav>
                        <Auth />
                    </nav>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <SiteFooter className="flex flex-col items-center justify-center py-10 w-full bg-primary relative space-y-20" />
        </div>
    );
}

export default Layout;