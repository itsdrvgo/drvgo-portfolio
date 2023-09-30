import ProjectsView from "@/src/components/projects/projects-view";
import ProjectsTableSkeleton from "@/src/components/projects/skeletons/projects-table";
import { Suspense } from "react";

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-[75rem] space-y-8 p-0">
                <div className="space-y-2 text-center">
                    <p className="text-3xl font-bold md:text-5xl">Projects</p>
                    <p className="text-sm text-gray-400 md:text-base">
                        View your projects and their status
                    </p>
                </div>

                <Suspense fallback={<ProjectsTableSkeleton />}>
                    <ProjectsView />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
