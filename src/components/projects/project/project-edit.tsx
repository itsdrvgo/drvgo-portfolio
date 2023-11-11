import { db } from "@/src/lib/drizzle";
import { projects } from "@/src/lib/drizzle/schema";
import { userSchema } from "@/src/lib/validation/user";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ProjectForm from "../../forms/project-form";

interface PageProps {
    params: {
        projectId: string;
    };
}

async function ProjectEdit({ params }: PageProps) {
    const [user, project] = await Promise.all([
        currentUser(),
        db.query.projects.findFirst({
            where: eq(projects.id, params.projectId),
        }),
    ]);

    if (!project) notFound();
    if (!user) redirect("/auth");

    const parsedUser = userSchema
        .omit({
            emailAddresses: true,
        })
        .parse(user);

    return <ProjectForm project={project} user={parsedUser} />;
}

export default ProjectEdit;
