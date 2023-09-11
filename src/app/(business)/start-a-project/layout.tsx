import { DashFooter } from "@/src/components/global/dash-footer";
import Navbar from "@/src/components/global/navbar-dash";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Start a Project",
    description: "Start a project with DRVGO today!",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <DashFooter />
        </div>
    );
}

export default Layout;
