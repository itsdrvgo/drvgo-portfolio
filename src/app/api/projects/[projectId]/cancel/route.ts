import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { projects } from "@/src/lib/drizzle/schema";
import { handleError, hasPermission } from "@/src/lib/utils";
import {
    ProjectContext,
    projectContextSchema,
} from "@/src/lib/validation/route";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: ProjectContext) {
    try {
        const { params } = projectContextSchema.parse(context);

        const user = await currentUser();
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const isOwner = hasPermission(
            user.privateMetadata.permissions,
            BitFieldPermissions.Administrator
        );

        if (!isOwner) {
            const existingProject = await db.query.projects.findFirst({
                where: and(
                    eq(projects.id, params.projectId),
                    eq(projects.purchaserId, user.id)
                ),
            });
            if (!existingProject)
                return NextResponse.json({
                    code: 403,
                    message: "Unauthorized!",
                });

            const clerkUser = await clerkClient.users.getUser(
                existingProject.purchaserId
            );

            await clerkClient.users.updateUserMetadata(clerkUser.id, {
                privateMetadata: {
                    ...clerkUser.privateMetadata,
                    strikes: clerkUser.privateMetadata.strikes + 1,
                },
            });
        }

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
