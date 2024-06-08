import { ClientProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { getAbsoluteURL } from "@/lib/utils";
import { LayoutProps } from "@/types";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: "%s | " + siteConfig.name,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [
        {
            name: siteConfig.name,
            url: getAbsoluteURL(),
        },
    ],
    creator: siteConfig.name,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: getAbsoluteURL(),
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
    manifest: getAbsoluteURL("/site.webmanifest"),
    metadataBase: new URL(getAbsoluteURL()),
};

function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className="min-h-screen overflow-x-hidden antialiased">
                <ClientProvider>
                    {children}
                    <Toaster />
                </ClientProvider>
            </body>
        </html>
    );
}

export default RootLayout;
