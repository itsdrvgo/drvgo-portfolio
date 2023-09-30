import { db } from "@/src/lib/drizzle";
import ProjectForm from "../forms/project-form";
import GoBackButton from "../global/buttons/go-back-button";
import { EmptyPlaceholder } from "../ui/empty-placeholder";

async function ProjectCreate() {
    const projectState = await db.query.projectsState.findFirst();

    return (
        <>
            {projectState && projectState.state ? (
                <ProjectForm />
            ) : (
                <EmptyPlaceholder
                    title="Projects are currently closed"
                    description="We are not accepting any new projects at the moment. Please check back later."
                    icon="lock"
                    endContent={<GoBackButton />}
                />
            )}
        </>
    );
}

export default ProjectCreate;
