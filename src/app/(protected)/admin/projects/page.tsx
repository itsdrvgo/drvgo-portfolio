import ProjectsView from "@/src/components/admin/projects/projects-view";
import ProjectsTableSkeleton from "@/src/components/admin/projects/skeletons/projects-table";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Projects",
    description: "Manager projects connected to the site",
};

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <div className="space-y-2 text-center">
                    <p className="text-4xl font-bold md:text-5xl">
                        Projects Table
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Manage your projects from here
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
