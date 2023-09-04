"use client";

import { DefaultProps } from "@/src/types";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/icons";
import { Button } from "../ui/button";

interface PageProps extends DefaultProps {
    params: {
        patchId: string;
    };
}

function PatchNav({ params }: PageProps) {
    const router = useRouter();

    return (
        <div>
            <Button
                className="flex items-center gap-1 border border-gray-700 bg-background"
                variant={"secondary"}
                onClick={() => router.push("/patches")}
            >
                <Icons.chevronLeft className="h-5 w-5" />
                <p>Go Back</p>
            </Button>
        </div>
    );
}

export default PatchNav;
