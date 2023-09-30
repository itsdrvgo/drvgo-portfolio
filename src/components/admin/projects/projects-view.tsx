import { db } from "@/src/lib/drizzle";
import { projects } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { desc } from "drizzle-orm";
import ProjectStatus from "./project-status";
import ProjectsTable from "./projects-table";

async function ProjectsView({ className }: DefaultProps) {
    const [projectsData, projectStateData] = await Promise.all([
        db.query.projects.findMany({
            with: {
                purchaser: true,
            },
            orderBy: [desc(projects.createdAt)],
        }),
        db.query.projectsState.findFirst(),
    ]);

    const state = (projectStateData && projectStateData.state) || false;

    return (
        <div className="flex flex-col gap-6">
            <ProjectStatus projectState={state} />
            <ProjectsTable data={projectsData} className={cn("", className)} />
        </div>
    );
}

export default ProjectsView;
