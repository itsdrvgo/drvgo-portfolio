import Footer from "@/src/components/global/footer/footer";
import Navbar from "@/src/components/global/navbar/navbar";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blogs",
    description: "Read my blogs on music, and programming",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
}

export default Layout;
