"use client";

import { About, Cutout, Landing, Showcase, TechStack } from "@/components/home";

function Page() {
    return (
        <>
            <Landing />
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
