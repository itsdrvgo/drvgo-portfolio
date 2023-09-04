import { Patch } from "@/src/lib/drizzle/schema";
import { cn, formatDate } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import Link from "next/link";
import PatchOperations from "./patch-item-operations";

interface PageProps extends DefaultProps {
    patch: Patch;
}

function PatchItem({ patch, className }: PageProps) {
    return (
        <div
            className={cn(
                "flex h-full w-full items-center justify-between rounded-md border border-border bg-background p-5",
                className
            )}
        >
            <div className="flex h-full basis-5/6 flex-col justify-between">
                <Link
                    href={`/admin/patches/${patch.id}`}
                    className="font-semibold hover:underline"
                >
                    {patch.major}.{patch.minor}.{patch.patch}
                </Link>
                <div>
                    <p className="text-sm text-muted-foreground">
                        {formatDate(patch.createdAt.getTime())}
                    </p>
                </div>
            </div>
            <PatchOperations
                patch={patch}
                className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
            />
        </div>
    );
}

export default PatchItem;
