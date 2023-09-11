"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/icons";

function ProjectStartButton() {
    const router = useRouter();

    return (
        <Button
            radius="sm"
            className="flex items-center justify-center gap-1 "
            onClick={() => router.push("/start-a-project")}
            color="secondary"
        >
            <Icons.sparkles className="h-4 w-4" />
            <p>Let&apos;s go</p>
        </Button>
    );
}

export { ProjectStartButton };
