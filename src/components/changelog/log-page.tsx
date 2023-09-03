import { db } from "@/src/lib/drizzle";
import { DefaultProps } from "@/src/types";
import { EmptyPlaceholder } from "../global/empty-placeholder";
import { GoBackButton } from "../global/go-back-button";

async function LogPage({ className }: DefaultProps) {
    const data = await db.query.changeLogs.findMany();

    return (
        <>
            {data.length ? (
                "hello"
            ) : (
                <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="construction" />
                    <EmptyPlaceholder.Title>
                        No change logs found
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        There are no change logs found. Come back later.
                    </EmptyPlaceholder.Description>
                    <GoBackButton />
                </EmptyPlaceholder>
            )}
        </>
    );
}

export default LogPage;
