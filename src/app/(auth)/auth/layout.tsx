import AuthBG from "@/public/laptop_auth_bg.webp";
import DRVGOLogo from "@/src/components/global/svgs/DRVGOLogo";
import { AspectRatio } from "@/src/components/ui/aspect-ratio";
import { siteConfig } from "@/src/config/site";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Authentication",
    description: "Sign in or sign up to DRVGO",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
            <AspectRatio ratio={16 / 9}>
                <Image
                    src={AuthBG}
                    alt="Auth background"
                    fill
                    className="absolute inset-0 object-cover"
                    priority
                />

                <Link
                    href="/"
                    className="absolute left-8 top-6 z-20 flex items-center gap-2 text-lg font-bold tracking-tight text-accent"
                >
                    <DRVGOLogo />
                    <span>{siteConfig.name}</span>
                </Link>
            </AspectRatio>

            <main className="container absolute top-1/2 col-span-1 flex -translate-y-1/2 items-center px-2 md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
                {children}
            </main>
        </div>
    );
}

export default Layout;
