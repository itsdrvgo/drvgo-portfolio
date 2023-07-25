import "./globals.css";
import { Toaster } from "@/src/components/ui/toaster";
import { siteConfig } from "@/src/config/site";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import Provider from "../components/global/providers";
import { cn } from "../lib/utils";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `${siteConfig.name} | %s`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [
        {
            name: siteConfig.name,
            url: siteConfig.url,
        },
    ],
    creator: siteConfig.name,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
    metadataBase: new URL(siteConfig.url),
};

interface RootLayoutProps {
    children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
    return (
        <Provider>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body
                    className={cn(
                        poppins.className,
                        "min-h-screen overflow-x-hidden scroll-smooth antialiased"
                    )}
                >
                    {children}
                    <Analytics />
                    <Toaster />
                </body>
            </html>
        </Provider>
    );
}

export default RootLayout;
