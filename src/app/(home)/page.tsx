"use client";

import About from "@/src/components/home/about";
import Landing from "@/src/components/home/landing";
import Newsletter from "@/src/components/home/newsletter";
import Projects from "@/src/components/home/projects";
import Skills from "@/src/components/home/skills";
import { Stripes } from "@/src/config/const";
import Image from "next/image";

function Page() {
    return (
        <>
            <Image
                src={Stripes}
                alt="Stripes"
                className="absolute left-0 top-0 -z-10 opacity-50"
                fill
                style={{ objectFit: "cover" }}
            />
            <Landing className="relative h-screen w-full overflow-hidden" />
            <About className="mb-20 flex min-h-screen items-center p-5 md:mb-0" />
            <Skills className="mb-20 flex min-h-screen items-center p-5 md:mb-0" />
            <Projects className="mb-20 flex min-h-screen items-center p-5 md:mb-0" />
            <Newsletter className="mb-40 flex items-center justify-center p-5 py-40" />
        </>
    );
}

export default Page;
