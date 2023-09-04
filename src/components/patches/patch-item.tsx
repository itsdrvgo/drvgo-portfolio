"use client";

import { Patch } from "@/src/lib/drizzle/schema";
import { cn, formatDate } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { useRouter } from "next/navigation";

interface PageProps extends DefaultProps {
    patch: Patch;
}

function PatchItem({ className, patch }: PageProps) {
    const router = useRouter();

    const handlePatchView = () => {
        router.push(`/patches/${patch.id}`);
    };

    return (
        <div
            className={cn(
                "flex h-full w-full cursor-pointer items-center justify-between rounded-md border border-border bg-background p-5 transition-all ease-in-out hover:bg-gray-800/75",
                className
            )}
            onClick={handlePatchView}
        >
            <p className="font-semibold">
                Patch {patch.major}.{patch.minor}.{patch.patch}
            </p>
            <p className="text-end text-sm text-gray-400">
                Published on {formatDate(patch.createdAt.getTime())}
            </p>
        </div>
    );
}

export default PatchItem;
