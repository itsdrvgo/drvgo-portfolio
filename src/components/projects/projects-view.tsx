import { db } from "@/src/lib/drizzle";
import { accounts, projects, users } from "@/src/lib/drizzle/schema";
import { currentUser } from "@clerk/nextjs";
import { desc, eq, like } from "drizzle-orm";
import { redirect } from "next/navigation";
import ProjectCreateButton from "../global/buttons/create-project-button";
import GoBackButton from "../global/buttons/go-back-button";
import { EmptyPlaceholder } from "../ui/empty-placeholder";
import ProjectsTable from "./projects-table";

async function ProjectsView() {
    const user = await currentUser();
    if (!user) redirect("/auth");

    const [owner, data] = await Promise.all([
        db.query.accounts.findFirst({
            where: like(accounts.roles, "%owner%"),
        }),
        db.query.projects.findMany({
            where: eq(projects.purchaserId, user.id),
            orderBy: [desc(projects.createdAt)],
            with: {
                purchaser: true,
            },
        }),
    ]);

    if (!owner)
        return (
            <EmptyPlaceholder
                title="Error"
                description="An error occurred while fetching projects. Please contact support."
                icon="warning"
                endContent={<GoBackButton />}
            />
        );

    return (
        <>
            {data.length ? (
                <ProjectsTable data={data} ownerId={owner.id} />
            ) : (
                <EmptyPlaceholder
                    title="No Projects"
                    description="You have no projects yet. Start a project to get started."
                    icon="folder"
                    endContent={
                        <ProjectCreateButton color="primary" variant="shadow" />
                    }
                />
            )}
        </>
    );
}

export default ProjectsView;
