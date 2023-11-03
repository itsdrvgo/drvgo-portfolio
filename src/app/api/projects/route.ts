import { db } from "@/src/lib/drizzle";
import { accounts, projects } from "@/src/lib/drizzle/schema";
import { addNotification } from "@/src/lib/notifications";
import { handleError } from "@/src/lib/utils";
import { projectCreateSchema } from "@/src/lib/validation/project";
import { NewProjectProps } from "@/src/types/notification";
import { currentUser } from "@clerk/nextjs";
import { and, eq, like, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const user = await currentUser();
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const projectState = await db.query.projectsState.findFirst();
        if (!projectState || !projectState.state)
            return NextResponse.json({
                code: 400,
                message: "We are not accepting new projects at this time!",
            });

        const { name, requirements, description } =
            projectCreateSchema.parse(body);

        const [owner, existingProject] = await Promise.all([
            db.query.accounts.findFirst({
                where: like(accounts.roles, "%owner%"),
            }),
            db.query.projects.findFirst({
                where: and(
                    eq(projects.purchaserId, user.id),
                    or(
                        eq(projects.status, "pending"),
                        eq(projects.status, "accepted"),
                        eq(projects.status, "paid"),
                        eq(projects.status, "in_progress")
                    )
                ),
            }),
        ]);

        if (!owner)
            return NextResponse.json({
                code: 400,
                message: "Could not create project, please contact support!",
            });

        if (existingProject)
            return NextResponse.json({
                code: 400,
                message: "You already have an active project!",
            });

        const projectId = nanoid();

        await db.insert(projects).values({
            id: projectId,
            name,
            requirements,
            description,
            purchaserId: user.id,
        });

        const result: Omit<NewProjectProps, "type"> = {
            projectId,
            projectTitle: name,
            purchaserId: user.id,
            purchaserUsername: user.username!,
            purchaserImage: user.imageUrl,
            sellerId: owner.id,
        };

        addNotification({
            title: "New Project",
            content: `@${result.purchaserUsername} has requested a new project`,
            notifierId: result.purchaserId,
            userId: result.sellerId,
            props: {
                type: "newProject",
                projectId: result.projectId,
                projectTitle: result.projectTitle,
                purchaserId: result.purchaserId,
                purchaserUsername: result.purchaserUsername,
                purchaserImage: result.purchaserImage,
                sellerId: result.sellerId,
            },
            type: "newProject",
        });

        return NextResponse.json({
            code: 201,
            message: "Ok",
            data: JSON.stringify(result),
        });
    } catch (err) {
        return handleError(err);
    }
}
