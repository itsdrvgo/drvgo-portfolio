"use client";

import { cn } from "@/src/lib/utils";
import { Button, ButtonProps } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icons } from "../../icons/icons";

function ProjectCreateButton({ className, ...props }: ButtonProps) {
    const router = useRouter();

    return (
        <Button
            aria-label="Create your first project"
            variant="faded"
            className={cn("", className)}
            radius="sm"
            onPress={() => router.push("/projects/create")}
            startContent={<Icons.add className="h-4 w-4" />}
            {...props}
        >
            Create Project
        </Button>
    );
}

export default ProjectCreateButton;
