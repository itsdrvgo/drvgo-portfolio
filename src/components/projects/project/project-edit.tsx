import { db } from "@/src/lib/drizzle";
import { projects } from "@/src/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProjectForm from "../../forms/project-form";

interface PageProps {
    params: {
        projectId: string;
    };
}

async function ProjectEdit({ params }: PageProps) {
    const project = await db.query.projects.findFirst({
        where: eq(projects.id, params.projectId),
    });
    if (!project) notFound();

    return <ProjectForm project={project} />;
}

export default ProjectEdit;
