import Journey from "@/src/components/home/journey";
import Landing from "@/src/components/home/landing";
import Newsletter from "@/src/components/home/newsletter";
import Skills from "@/src/components/home/skills";
import "./page.css";

function Page() {
    return (
        <>
            <Landing className="min-h-screen w-full overflow-hidden" />
            <Skills className="relative mb-20 flex min-h-screen items-center p-5 md:mb-0" />
            <Journey className="relative mb-20 flex min-h-screen items-center p-5 md:mb-0" />
            <Newsletter className="relative mb-40 flex items-center justify-center p-5 py-40" />
        </>
    );
}

export default Page;
