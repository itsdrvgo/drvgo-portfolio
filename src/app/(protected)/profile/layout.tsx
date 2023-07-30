import { DashFooter } from "@/src/components/global/dash-footer";
import Navbar from "@/src/components/global/navbar";
import SideBar from "@/src/components/profile/sidebar";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile",
    description: "Manage your profile",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1">
                <section className="m-5 flex min-h-[calc(100vh-5rem)] justify-center">
                    <SideBar>{children}</SideBar>
                </section>
            </main>

            <DashFooter />
        </div>
    );
}

export default Layout;
