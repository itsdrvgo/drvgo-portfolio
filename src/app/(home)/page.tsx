import Landing from "@/src/components/home/landing";
import About from "@/src/components/home/about";
import Skills from "@/src/components/home/skills";
import Projects from "@/src/components/home/projects";
import Newsletter from "@/src/components/home/newsletter";

function Page() {
    return (
        <>
            <Landing className="min-h-[calc(100vh-5rem)] flex items-center m-5" />
            <About className="min-h-screen flex items-center justify-center m-5" />
            <Skills className="min-h-screen flex items-center justify-center m-5" />
            <Projects className="min-h-screen flex items-center justify-center m-5" />
            <Newsletter className="flex items-center justify-center m-5 mb-40 py-40" />
        </>
    );
}

export default Page;
