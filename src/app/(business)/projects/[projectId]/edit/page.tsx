import ProjectEdit from "@/src/components/projects/project/project-edit";
import ProjectFormSkeleton from "@/src/components/projects/skeletons/project-edit";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Edit Project",
    description: "Edit your existing project",
};

interface PageProps {
    params: {
        projectId: string;
    };
}

function Page({ params }: PageProps) {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-[65rem] space-y-8 p-0">
                <div className="space-y-2 text-center">
                    <p className="text-3xl font-bold md:text-5xl">
                        Edit Project
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Edit your existing project here
                    </p>
                </div>

                <Suspense fallback={<ProjectFormSkeleton />}>
                    <ProjectEdit params={params} />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
