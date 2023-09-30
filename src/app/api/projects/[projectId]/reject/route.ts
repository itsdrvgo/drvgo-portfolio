import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { projects } from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { projectPatchSchema } from "@/src/lib/validation/project";
import {
    ProjectContext,
    projectContextSchema,
} from "@/src/lib/validation/route";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: ProjectContext) {
    try {
        const json = await req.json();

        const { params } = projectContextSchema.parse(context);

        const user = await getAuthorizedUser(BitFieldPermissions.Administrator);
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const { rejectedReason } = projectPatchSchema
            .pick({
                rejectedReason: true,
            })
            .required()
            .parse(json);

        await db
            .update(projects)
            .set({
                rejectedAt: new Date(),
                rejectedReason,
                status: "rejected",
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
