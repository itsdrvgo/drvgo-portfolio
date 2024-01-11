"use client";

import Journey from "@/src/components/home/journey";
import Landing from "@/src/components/home/landing";
import Skills from "@/src/components/home/skills";
import "./page.css";
import Projects from "@/src/components/home/projects";

function Page() {
    return (
        <>
            <Landing />
            <Skills />
            <Journey />
            <Projects />
        </>
    );
}

export default Page;
