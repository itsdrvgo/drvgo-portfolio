import { db } from "@/src/lib/drizzle";
import { patches } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { desc } from "drizzle-orm";
import { EmptyPlaceholder } from "../../global/empty-placeholder";
import PatchCreateButton from "./patch-create-button";
import PatchItem from "./patch-item";

async function PatchViewPage({ className }: DefaultProps) {
    const data = await db.query.patches.findMany({
        orderBy: [desc(patches.createdAt)],
    });

    return (
        <>
            {data.length > 0 ? (
                <div
                    className={cn(
                        "flex flex-col items-center gap-5",
                        className
                    )}
                >
                    {data.map((patch) => (
                        <PatchItem key={patch.id} patch={patch} />
                    ))}
                </div>
            ) : (
                <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="document" />
                    <EmptyPlaceholder.Title>
                        No patches created
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        You don&apos;t have any patches yet. Write a patch.
                    </EmptyPlaceholder.Description>
                    <PatchCreateButton variant="outline" />
                </EmptyPlaceholder>
            )}
        </>
    );
}

export default PatchViewPage;
