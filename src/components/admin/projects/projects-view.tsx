import { db } from "@/src/lib/drizzle";
import { projects, projectsState } from "@/src/lib/drizzle/schema";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import ProjectStatus from "./project-status";
import ProjectsTable from "./projects-table";

async function ProjectsView({ className }: DefaultProps) {
    const [projectsData, projectStateData, user] = await Promise.all([
        db.query.projects.findMany({
            with: {
                purchaser: true,
            },
            orderBy: [desc(projects.createdAt)],
        }),
        db.query.projectsState.findFirst(),
        currentUser(),
    ]);

    if (!user) redirect("/auth");

    let state: boolean;

    if (!projectStateData) {
        await db.insert(projectsState).values({
            id: nanoid(),
            state: false,
        });
        state = false;
    } else state = projectStateData.state;

    const parsedUser = userSchema
        .omit({
            emailAddresses: true,
        })
        .parse(user);

    return (
        <div className="flex flex-col gap-6">
            <ProjectStatus projectState={state} />
            <ProjectsTable
                data={projectsData}
                className={className}
                user={parsedUser}
            />
        </div>
    );
}

export default ProjectsView;
