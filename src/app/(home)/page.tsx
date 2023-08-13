import About from "@/src/components/home/about";
import Landing from "@/src/components/home/landing";
import Newsletter from "@/src/components/home/newsletter";
import Projects from "@/src/components/home/projects";
import Skills from "@/src/components/home/skills";

function Page() {
    return (
        <>
            <Landing className="m-5 flex min-h-[calc(100vh-5rem)] items-center" />
            <About className="m-5 flex min-h-screen items-center justify-center pt-10 md:pt-0" />
            <Skills className="m-5 flex min-h-screen items-center justify-center" />
            <Projects className="m-5 flex min-h-screen items-center justify-center" />
            <Newsletter className="m-5 mb-40 flex items-center justify-center py-40" />
        </>
    );
}

export default Page;
