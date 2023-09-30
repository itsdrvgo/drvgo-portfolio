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
            <div className="container max-w-[75rem] space-y-10 p-0 md:space-y-16">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold">Projects Table</p>
                    <p className="text-gray-400">
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
