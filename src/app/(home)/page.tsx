"use client";

import Journey from "@/src/components/home/journey";
import Landing from "@/src/components/home/landing";
import Newsletter from "@/src/components/home/newsletter";
import Skills from "@/src/components/home/skills";
import "./page.css";
import { LazyMotion } from "framer-motion";

const lazyFeatures = () =>
    import("@/src/lib/framer").then((res) => res.default);

function Page() {
    return (
        <LazyMotion features={lazyFeatures} strict>
            <Landing className="min-h-screen w-full overflow-hidden" />
            <Skills className="relative mb-20 flex min-h-screen items-center p-5 md:mb-0" />
            <Journey className="relative mb-20 flex min-h-screen items-center p-5 md:mb-0" />
            <Newsletter className="relative mb-40 flex items-center justify-center p-5 py-40" />
        </LazyMotion>
    );
}

export default Page;
