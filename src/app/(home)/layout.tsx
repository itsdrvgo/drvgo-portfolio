"use client";

import { SiteFooter } from "@/src/components/global/footer";
import HomeNavbar from "@/src/components/global/home-navbar";
import { cn } from "@/src/lib/utils";
import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
    title: "Home",
};

function Layout({ children }: RootLayoutProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [loaded, setLoaded] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoaded((prev) => {
                if (prev >= 95) {
                    clearInterval(interval);
                    setIsLoading(false);
                    return 100;
                }

                if (prev < 10) {
                    return prev + 1;
                }

                if (prev < 30) {
                    return prev + 2;
                }

                if (prev < 50) {
                    return prev + 3;
                }

                if (prev < 70) {
                    return prev + 4;
                }

                if (prev < 90) {
                    return prev + 5;
                }

                return prev + 6;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={cn(
                "relative flex flex-col",
                isLoading
                    ? "h-screen overflow-hidden"
                    : "min-h-screen overflow-auto"
            )}
        >
            <div
                className={cn(
                    "absolute left-0 top-0 z-[60] flex h-screen w-full items-center justify-center bg-background transition-all duration-1000 ease-in-out",
                    isLoading ? "translate-y-0" : "-translate-y-full"
                )}
            >
                <p>
                    <span className="text-2xl font-bold">Loading </span>
                    <span className="text-2xl font-bold text-blue-500">
                        {loaded}%
                    </span>
                </p>
            </div>

            <HomeNavbar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    );
}

export default Layout;
