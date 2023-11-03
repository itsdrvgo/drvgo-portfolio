import ProjectCreate from "@/src/components/projects/project-create";
import ProjectFormSkeleton from "@/src/components/projects/skeletons/project-edit";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Start a Project",
    description: "Start a project with us!",
};

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <div className="space-y-2 text-center">
                    <p className="text-4xl font-bold md:text-5xl">
                        Start a Project
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Interested in working together? We can have a chat, and
                        see if we&apos;re a good fit for each other.
                    </p>
                </div>

                <Suspense fallback={<ProjectFormSkeleton />}>
                    <ProjectCreate />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
