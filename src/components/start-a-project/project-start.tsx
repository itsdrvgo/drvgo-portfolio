import { DefaultProps } from "@/src/types";
import { ProjectStartForm } from "../forms/project-start-form";

async function ProjectStart({ className }: DefaultProps) {
    return (
        <>
            <ProjectStartForm />
        </>
    );
}

export default ProjectStart;
