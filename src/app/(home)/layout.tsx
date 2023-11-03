import FooterHome from "@/src/components/global/footer/footer-home";
import NavbarHome from "@/src/components/global/navbar/navbar-home";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden">
            <NavbarHome />
            <main className="relative flex-1">{children}</main>
            <FooterHome />
        </div>
    );
}

export default Layout;
