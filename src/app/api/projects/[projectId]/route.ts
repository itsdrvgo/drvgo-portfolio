import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { projects } from "@/src/lib/drizzle/schema";
import { handleError, hasPermission } from "@/src/lib/utils";
import { projectPatchSchema } from "@/src/lib/validation/project";
import {
    ProjectContext,
    projectContextSchema,
} from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: ProjectContext) {
    try {
        const json = await req.json();

        const { params } = projectContextSchema.parse(context);

        const user = await currentUser();
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const { name, description, requirements, price, deadline } =
            projectPatchSchema
                .pick({
                    name: true,
                    description: true,
                    requirements: true,
                    price: true,
                    deadline: true,
                })
                .parse(json);

        if (!checkPriceChangeAccess(user, price))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const project = await db.query.projects.findFirst({
            where: eq(projects.id, params.projectId),
        });
        if (!project)
            return NextResponse.json({
                code: 404,
                message: "Not found!",
            });

        await db
            .update(projects)
            .set({
                deadline: deadline ? new Date(deadline) : project.deadline,
                price: price ?? project.price,
                description: description ?? project.description,
                name: name ?? project.name,
                requirements: requirements ?? project.requirements,
                status:
                    ((price && price > 0) || project.price > 0) &&
                    (deadline || project.deadline) &&
                    project.status !== "in_progress"
                        ? "in_progress"
                        : project.status,
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

function checkPriceChangeAccess(user: User, price?: number) {
    const isOwner = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.Administrator
    );

    return price && isOwner;
}
