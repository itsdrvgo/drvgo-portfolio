import FooterDash from "@/src/components/global/footer/footer-dash";
import NavbarDash from "@/src/components/global/navbar/navbar-dash";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Admin Panel",
        template: "Admin Panel | %s",
    },
    description: "Take administrative actions",
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
