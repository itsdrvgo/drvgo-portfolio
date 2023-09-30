import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { projects } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import {
    ProjectContext,
    projectContextSchema,
} from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: ProjectContext) {
    try {
        const { params } = projectContextSchema.parse(context);

        if (!(await hasAccessToProject(params.projectId)))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        await db
            .update(projects)
            .set({
                cancelledAt: new Date(),
                status: "cancelled",
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

async function hasAccessToProject(projectId: string) {
    const user = await currentUser();
    if (!user) return false;
    if (user.privateMetadata.permissions & BitFieldPermissions.Administrator)
        return true;

    const project = await db.query.projects.findFirst({
        where: and(
            eq(projects.id, projectId),
            eq(projects.purchaserId, user.id)
        ),
    });

    if (!project) return false;
    return false;
}
