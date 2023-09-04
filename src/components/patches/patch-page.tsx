import { db } from "@/src/lib/drizzle";
import { patches } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { desc, eq } from "drizzle-orm";
import { EmptyPlaceholder } from "../global/empty-placeholder";
import { GoBackButton } from "../global/go-back-button";
import PatchItem from "./patch-item";

async function PatchPage({ className }: DefaultProps) {
    const data = await db.query.patches.findMany({
        where: eq(patches.published, true),
        orderBy: [desc(patches.createdAt)],
    });

    return (
        <>
            {data.length ? (
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
                    <EmptyPlaceholder.Icon name="construction" />
                    <EmptyPlaceholder.Title>
                        No patch notes found
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        There are no patch notes yet. Check back later.
                    </EmptyPlaceholder.Description>
                    <GoBackButton />
                </EmptyPlaceholder>
            )}
        </>
    );
}

export default PatchPage;
