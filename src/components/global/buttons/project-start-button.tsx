"use client";

import { cn } from "@/src/lib/utils";
import { Button, ButtonProps } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icons } from "../../icons/icons";

function ProjectStartButton({ className, ...props }: ButtonProps) {
    const router = useRouter();

    return (
        <Button
            radius="sm"
            className={cn("", className)}
            onPress={() => router.push("/projects/create")}
            startContent={<Icons.sparkles className="h-4 w-4" />}
            {...props}
        >
            Let&apos;s go
        </Button>
    );
}

export default ProjectStartButton;
