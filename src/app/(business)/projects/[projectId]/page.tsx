import ProjectViewSkeleton from "@/src/components/admin/projects/skeletons/project-view";
import ProjectView from "@/src/components/projects/project/project-view";
import { db } from "@/src/lib/drizzle";
import { projects } from "@/src/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { projectId } = params;

    const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
    });
    if (!project) return { title: "Project" };

    return {
        title: "Project - " + project.name,
        description: project.description,
    };
}

interface PageProps {
    params: {
        projectId: string;
    };
}

function Page({ params }: PageProps) {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-[65rem] space-y-10 p-0 md:space-y-16">
                <Suspense fallback={<ProjectViewSkeleton />}>
                    <ProjectView params={params} />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
