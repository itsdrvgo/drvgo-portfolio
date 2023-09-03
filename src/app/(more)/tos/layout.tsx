import { DashFooter } from "@/src/components/global/dash-footer";
import Navbar from "@/src/components/global/navbar";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Services",
    description: "Read the terms of services of using DRVGO",
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
