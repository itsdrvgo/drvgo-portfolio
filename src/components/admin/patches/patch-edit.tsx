import { db } from "@/src/lib/drizzle";
import { patches } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import PatchWriteUp from "./patch-edit-writeup";

interface PageProps extends DefaultProps {
    params: {
        patchId: string;
    };
}

async function PatchEditPage({ params }: PageProps) {
    const data = await db.query.patches.findFirst({
        where: eq(patches.id, params.patchId),
    });
    if (!data) notFound();

    return <PatchWriteUp params={params} data={data} />;
}

export default PatchEditPage;
