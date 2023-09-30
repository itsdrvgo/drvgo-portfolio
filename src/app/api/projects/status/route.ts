import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { projectsState } from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const projectStateValidator = z.object({
    state: z.boolean(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { state } = projectStateValidator.parse(body);

        const user = await getAuthorizedUser(BitFieldPermissions.Administrator);
        if (!user)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized!",
            });

        const existingProjectsState = await db.query.projectsState.findFirst();
        if (!existingProjectsState)
            await db.insert(projectsState).values({
                id: nanoid(),
                state,
            });

        await db.update(projectsState).set({
            state,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify({
                state,
            }),
        });
    } catch (err) {
        return handleError(err);
    }
}
