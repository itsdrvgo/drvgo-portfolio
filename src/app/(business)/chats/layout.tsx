import SideBarFetch from "@/src/components/chats/sidebar/sidebar-fetch";
import { SidebarSkeleton } from "@/src/components/chats/skeletons/sidebar";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Chats",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <Suspense fallback={<SidebarSkeleton />}>
            <SideBarFetch>{children}</SideBarFetch>
        </Suspense>
    );
}

export default Layout;
