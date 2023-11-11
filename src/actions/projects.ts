"use server";

import { clerkClient, currentUser } from "@clerk/nextjs";
import { and, eq, like, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import { BitFieldPermissions } from "../config/const";
import { db } from "../lib/drizzle";
import {
    accounts,
    Project,
    projects,
    projectsState,
} from "../lib/drizzle/schema";
import { getAuthorizedUser, hasPermission } from "../lib/utils";
import { ClerkUserWithoutEmail } from "../lib/validation/user";
import { NewProjectProps } from "../types/notification";
import { addNotificationToUser } from "./notifications";

export async function createProject({
    props,
    state,
}: {
    props: {
        name: string;
        requirements: string;
        description: string;
    };
    state?: boolean;
}) {
    const { name, requirements, description } = props;

    const user = await currentUser();
    if (!user) throw new Error("You are not authorized!");
    if (!state)
        throw new Error("We are not accepting new projects at this time!");

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
        throw new Error("Could not create project, please contact support!");
    if (existingProject) throw new Error("You already have an active project!");

    const projectId = nanoid();

    await db.insert(projects).values({
        id: projectId,
        name,
        requirements,
        description,
        purchaserId: user.id,
        status: "pending",
    });

    const result: Omit<NewProjectProps, "type"> = {
        projectId: projectId,
        projectTitle: name,
        purchaserId: user.id,
        purchaserUsername: user.username!,
        purchaserImage: user.imageUrl,
        sellerId: owner.id,
    };

    addNotificationToUser({
        title: "New Project",
        content: `@${result.purchaserUsername} has requested a new project`,
        notifierId: result.purchaserId,
        receiverId: result.sellerId,
        type: "newProject",
        props: {
            ...result,
            type: "newProject",
        },
    });

    return {
        project: result,
    };
}

export async function manageProjectState({ state }: { state: boolean }) {
    const user = await getAuthorizedUser(BitFieldPermissions.Administrator);
    if (!user) throw new Error("You are not authorized!");

    await db.update(projectsState).set({
        state,
    });

    return {
        state,
    };
}

export async function updateProject({
    project,
    props,
    user,
}: {
    project: Project;
    props: {
        name?: string;
        description?: string;
        requirements?: string;
        price?: number;
        deadline?: string;
    };
    user: ClerkUserWithoutEmail;
}) {
    const { name, description, requirements, price, deadline } = props;

    const isOwner = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.Administrator
    );

    if ((price || deadline) && !isOwner)
        throw new Error("You are not authorized!");

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
        .where(eq(projects.id, project.id));

    return {
        id: project.id,
    };
}

export async function manageProjectStatus({
    id,
    props,
}: {
    id: string;
    props: {
        status:
            | "accepted"
            | "paid"
            | "in_progress"
            | "completed"
            | "cancelled"
            | "rejected";
        reason?: string;
    };
}) {
    const { status, reason } = props;

    if (status === "cancelled") {
        const user = await currentUser();
        if (!user) throw new Error("You are not authorized!");

        const isOwner = hasPermission(
            user.privateMetadata.permissions,
            BitFieldPermissions.Administrator
        );

        if (!isOwner) {
            const existingProject = await db.query.projects.findFirst({
                where: and(
                    eq(projects.id, id),
                    eq(projects.purchaserId, user.id)
                ),
            });
            if (!existingProject) throw new Error("You are not authorized!");

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
            .where(eq(projects.id, id));

        return {
            id,
        };
    } else {
        const user = await getAuthorizedUser(BitFieldPermissions.Administrator);
        if (!user) throw new Error("You are not authorized!");

        let projectStatus: {
            acceptedAt?: Date;
            rejectedAt?: Date;
            completedAt?: Date;
            cancelledAt?: Date;
            paidAt?: Date;
            status:
                | "accepted"
                | "rejected"
                | "completed"
                | "cancelled"
                | "paid"
                | "in_progress";
            rejectedReason?: string;
        };

        switch (status) {
            case "accepted":
                projectStatus = {
                    acceptedAt: new Date(),
                    status: "accepted",
                };
                break;
            case "paid":
                projectStatus = {
                    paidAt: new Date(),
                    status: "paid",
                };
                break;
            case "in_progress":
                projectStatus = {
                    status: "in_progress",
                };
                break;
            case "completed":
                projectStatus = {
                    completedAt: new Date(),
                    status: "completed",
                };
                break;
            case "rejected":
                projectStatus = {
                    rejectedAt: new Date(),
                    rejectedReason: reason,
                    status: "rejected",
                };
                break;
            default:
                throw new Error("Invalid status!");
        }

        await db.update(projects).set(projectStatus).where(eq(projects.id, id));

        return {
            id,
        };
    }
}
