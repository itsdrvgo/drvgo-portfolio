"use client";

import FooterHome from "@/src/components/global/footer/footer-home";
import NavbarHome from "@/src/components/global/navbar/navbar-home";
import About from "@/src/components/home/about";
import Landing from "@/src/components/home/landing";
import Newsletter from "@/src/components/home/newsletter";
import Projects from "@/src/components/home/projects";
import Skills from "@/src/components/home/skills";
import { cn } from "@/src/lib/utils";
import { useEffect, useState } from "react";

function Page() {
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

                if (prev < 20) {
                    return prev + 10;
                }

                if (prev < 50) {
                    return prev + 30;
                }

                if (prev < 90) {
                    return prev + 10;
                }

                return prev + 5;
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
                    "absolute left-0 top-0 z-[60] flex h-screen w-full items-center justify-center bg-background transition-all ease-in-out",
                    isLoading ? "translate-y-[0%]" : "-translate-y-full"
                )}
            >
                <p>
                    <span className="text-2xl font-bold">Loading </span>
                    <span className="text-2xl font-bold text-blue-500">
                        {loaded}%
                    </span>
                </p>
            </div>

            <NavbarHome />

            <main
                className="flex-1"
                style={{
                    backgroundImage: "url(/stripes.svg)",
                    backgroundSize: "cover",
                }}
            >
                <Landing className="relative h-screen w-full overflow-hidden" />
                <About className="mb-20 flex min-h-screen items-center p-5 md:mb-0" />
                <Skills className="mb-20 flex min-h-screen items-center p-5 md:mb-0" />
                <Projects className="mb-20 flex min-h-screen items-center p-5 md:mb-0" />
                <Newsletter className="mb-40 flex items-center justify-center p-5 py-40" />
            </main>

            <FooterHome />
        </div>
    );
}

export default Page;
