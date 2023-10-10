import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { roles } from "@/src/lib/drizzle/schema";
import { redis } from "@/src/lib/redis";
import {
    addRoleToCache,
    getAllRolesFromCache,
} from "@/src/lib/redis/methods/roles";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const rolesPatchSchema = z.array(
    z.object({
        id: z.string(),
        position: z.number(),
    })
);

export async function POST() {
    try {
        const user = await getAuthorizedUser(
            BitFieldPermissions.ManageRoles | BitFieldPermissions.ManagePages
        );
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const roleId = nanoid();

        const currentRoles = await getAllRolesFromCache();
        const maxPosition = Math.max(...currentRoles.map((r) => r.position));

        await Promise.all([
            db.insert(roles).values({
                id: roleId,
                name: "new_role_" + roleId,
                key: "new_role_" + roleId,
                permissions: 1,
                position: maxPosition + 1,
            }),
            addRoleToCache({
                id: roleId,
                name: "new_role_" + roleId,
                key: "new_role_" + roleId,
                permissions: 1,
                position: maxPosition + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }),
        ]);

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(roleId),
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();

        const user = await getAuthorizedUser(
            BitFieldPermissions.ManageRoles | BitFieldPermissions.ManagePages
        );
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const updatedRoles = rolesPatchSchema.parse(body);
        const existingRoles = await getAllRolesFromCache();

        const deletedRoles = existingRoles.filter(
            (role) => !updatedRoles.find((r) => r.id === role.id)
        );

        const pipeline = redis.pipeline();

        if (deletedRoles.length > 0) {
            deletedRoles.forEach(async (role) => {
                pipeline.del(`role:${role.id}`);
                await db.delete(roles).where(eq(roles.id, role.id));
            });

            updatedRoles.forEach(async (role) => {
                const roleToBeUpdated = existingRoles.find(
                    (r) => r.id === role.id
                );
                pipeline.set(
                    `role:${role.id}`,
                    JSON.stringify({
                        ...roleToBeUpdated,
                        position: role.position,
                    })
                );

                await db
                    .update(roles)
                    .set({
                        position: role.position,
                    })
                    .where(eq(roles.id, role.id));
            });

            await pipeline.exec();
        } else {
            updatedRoles.forEach(async (role) => {
                const roleToBeUpdated = existingRoles.find(
                    (r) => r.id === role.id
                );
                pipeline.set(
                    `role:${role.id}`,
                    JSON.stringify({
                        ...roleToBeUpdated,
                        position: role.position,
                    })
                );

                await db
                    .update(roles)
                    .set({
                        position: role.position,
                    })
                    .where(eq(roles.id, role.id));
            });

            await pipeline.exec();
        }

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
