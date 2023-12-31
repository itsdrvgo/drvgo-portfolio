import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { projects } from "@/src/lib/drizzle/schema";
import { hasPermission } from "@/src/lib/utils";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProjectRead from "./project-read";

interface PageProps extends DefaultProps {
    params: {
        projectId: string;
    };
}

async function ProjectView({ className, params, ...props }: PageProps) {
    const [user, project] = await Promise.all([
        currentUser(),
        db.query.projects.findFirst({
            where: eq(projects.id, params.projectId),
            with: {
                purchaser: true,
            },
        }),
    ]);

    if (!user || !project) notFound();
    const isOwner = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.Administrator
    );

    if (!isOwner && project.purchaserId !== user.id) notFound();

    const parsedUser = userSchema
        .omit({
            emailAddresses: true,
        })
        .parse(user);

    return (
        <ProjectRead
            project={project}
            className={className}
            isOwner={isOwner}
            user={parsedUser}
            {...props}
        />
    );
}

export default ProjectView;
