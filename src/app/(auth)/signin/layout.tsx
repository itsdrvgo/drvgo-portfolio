import { DRVGOIcon, Stripes } from "@/src/config/const";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your existing account",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full">
                <div className="container flex items-center justify-center py-6">
                    <Link href={"/"}>
                        <Image
                            src={DRVGOIcon}
                            alt="DRVGO"
                            height={110}
                            width={110}
                        />
                    </Link>
                </div>
            </header>
            <main className="flex-1">
                <Image
                    src={Stripes}
                    alt="Stripes"
                    className="absolute left-0 top-0 -z-10 opacity-50"
                    fill
                    style={{ objectFit: "cover" }}
                />
                {children}
            </main>
        </div>
    );
}

export default Layout;
