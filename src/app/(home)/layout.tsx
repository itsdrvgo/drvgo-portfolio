import { SiteFooter } from "@/src/components/global/footer";
import HomeNavbar from "@/src/components/global/home-navbar";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <HomeNavbar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    );
}

export default Layout;
