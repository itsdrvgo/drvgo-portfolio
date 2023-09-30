import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { projects } from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import {
    ProjectContext,
    projectContextSchema,
} from "@/src/lib/validation/route";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: ProjectContext) {
    try {
        const { params } = projectContextSchema.parse(context);

        const user = await getAuthorizedUser(BitFieldPermissions.Administrator);
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        await db
            .update(projects)
            .set({
                completedAt: new Date(),
                status: "completed",
            })
            .where(eq(projects.id, params.projectId));

        return NextResponse.json({
            code: 204,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
