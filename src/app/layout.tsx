import "./globals.css";
import { Poppins } from "next/font/google";
import { siteConfig } from "@/src/config/site";
import { Toaster } from "@/src/components/ui/toaster";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    variable: "--font-poppins"
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
        }
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
    metadataBase: new URL(siteConfig.url)
};

interface RootLayoutProps {
    children: React.ReactNode
}

function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={`${poppins.className} min-h-screen antialiased overflow-x-hidden scroll-smooth`}>
                {children}
                <Analytics />
                <Toaster />
            </body>
        </html>
    );
}

export default RootLayout;