import FooterDash from "@/src/components/global/footer/footer-dash";
import NavbarDash from "@/src/components/global/navbar/navbar-dash";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects",
    description: "Keep track of your projects!",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <NavbarDash />
            <main className="flex-1">{children}</main>
            <FooterDash />
        </div>
    );
}

export default Layout;
