import "./globals.css";
import { siteConfig } from "@/src/config/site";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ClientProvider from "../components/providers/client";
import ServerProvider from "../components/providers/server";
import { cn } from "../lib/utils";
import { RootLayoutProps } from "../types";

const poppins = Titillium_Web({
    subsets: ["latin"],
    weight: ["200", "300", "400", "600", "700"],
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
    themeColor: [{ color: "black" }],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: "@itsdrvgo",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
    metadataBase: new URL(siteConfig.url),
};

function RootLayout({ children }: RootLayoutProps) {
    return (
        <ServerProvider>
            <html lang="en" suppressHydrationWarning className="dark">
                <head />
                <body
                    className={cn(
                        poppins.className,
                        "min-h-screen overflow-x-hidden scroll-smooth antialiased"
                    )}
                >
                    <ClientProvider>{children}</ClientProvider>
                    <Analytics />
                    <Toaster
                        toastOptions={{
                            style: {
                                background: "#333",
                                color: "#fff",
                            },
                        }}
                    />
                </body>
            </html>
        </ServerProvider>
    );
}

export default RootLayout;
