"use client";

import { About, Cutout, Hero, Showcase, TechStack } from "@/components/home";

function Page() {
    return (
        <>
            <Hero />
            <About />
            <Cutout isReversed />
            <Showcase />
            <Cutout />
            <TechStack />
            <Cutout isReversed />
        </>
    );
}

export default Page;
