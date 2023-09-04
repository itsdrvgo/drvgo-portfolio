import { db } from "@/src/lib/drizzle";
import {
    insertPatchSchema,
    NewPatch,
    patches,
    users,
} from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const authUser = await currentUser();
        if (!authUser)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const data = await db.query.patches.findMany();

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(data),
        });
    } catch (err) {
        handleError(err);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const authUser = await currentUser();
        if (!authUser)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
        });
        if (!dbUser || ["user", "moderator"].includes(dbUser.role))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const { description, major, minor, patch } = insertPatchSchema
            .omit({
                id: true,
            })
            .parse(body);

        let data: Omit<NewPatch, "id">;

        const latestPatch = await db
            .select()
            .from(patches)
            .orderBy(
                desc(patches.major),
                desc(patches.minor),
                desc(patches.patch)
            )
            .limit(1);

        if (latestPatch.length === 0)
            data = {
                major,
                minor,
                patch,
                description,
            };
        else
            data = {
                major: latestPatch[0].major,
                minor: latestPatch[0].minor,
                patch: latestPatch[0].patch + 1,
                description: latestPatch[0].description,
            };

        const patchId = crypto.randomUUID();

        await db.insert(patches).values({
            id: patchId,
            ...data,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(patchId),
        });
    } catch (err) {
        handleError(err);
    }
}
