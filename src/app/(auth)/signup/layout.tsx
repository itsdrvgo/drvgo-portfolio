import DRVGOLogo from "@/public/DRVGO.svg";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create a new account",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full bg-background">
                <div className="container flex items-center justify-center py-6">
                    <Link href={"/"}>
                        <Image
                            src={DRVGOLogo}
                            alt="DRVGO"
                            height={110}
                            width={110}
                        />
                    </Link>
                </div>
            </header>
            <main className="flex-1">{children}</main>
        </div>
    );
}

export default Layout;