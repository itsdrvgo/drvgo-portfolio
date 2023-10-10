import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { insertRoleSchema, roles } from "@/src/lib/drizzle/schema";
import { redis } from "@/src/lib/redis";
import {
    getAllRolesFromCache,
    updateRoleInCache,
} from "@/src/lib/redis/methods/roles";
import { getAllUsersFromCache } from "@/src/lib/redis/methods/user";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { RoleContext, roleContextSchema } from "@/src/lib/validation/route";
import { clerkClient } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: RoleContext) {
    try {
        const body = await req.json();
        const { params } = roleContextSchema.parse(context);

        const user = await getAuthorizedUser(
            BitFieldPermissions.ManageRoles | BitFieldPermissions.ManagePages
        );
        if (!user)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized!",
            });

        const { name, permissions } = insertRoleSchema
            .pick({
                name: true,
                permissions: true,
            })
            .partial()
            .parse(body);

        const allRoles = await getAllRolesFromCache();
        const role = allRoles.find((x) => x.id === params.roleId);

        if (!role)
            return NextResponse.json({
                code: 404,
                message: "Role not found!",
            });

        const users = await getAllUsersFromCache();
        const usersWithRole = users.filter((x) => x.roles.includes(role.key));

        if (usersWithRole.length > 0) {
            if (permissions && permissions !== role.permissions) {
                const pipeline = redis.pipeline();

                usersWithRole.map(async (u) => {
                    const accountRoles = u.roles.map((x) => {
                        const r = allRoles.find((y) => y.key === x);
                        if (!r) return null;
                        return r;
                    });

                    const accountHighestRole = accountRoles.reduce(
                        (prev, curr) => {
                            if (!prev) return curr;
                            if (!curr) return prev;
                            return prev.position > curr.position ? curr : prev;
                        },
                        null
                    );
                    if (!accountHighestRole) return;

                    if (role.position <= accountHighestRole.position) {
                        await clerkClient.users.updateUserMetadata(u.id, {
                            privateMetadata: {
                                permissions,
                                roles: u.roles,
                                strikes: u.strikes,
                            },
                        });

                        pipeline.set(
                            `user:${u.id}`,
                            JSON.stringify({
                                ...u,
                                permissions,
                            })
                        );
                    }
                });

                await pipeline.exec();
            }

            if (name && name !== role.name) {
                const pipeline = redis.pipeline();

                usersWithRole.forEach(async (u) => {
                    const newRoles = u.roles.map((x) =>
                        x === role.key
                            ? name.toLowerCase().replace(/\s/g, "_")
                            : x
                    );

                    await clerkClient.users.updateUserMetadata(u.id, {
                        privateMetadata: {
                            roles: newRoles,
                            permissions: u.permissions,
                            strikes: u.strikes,
                        },
                    });

                    pipeline.set(
                        `user:${u.id}`,
                        JSON.stringify({
                            ...u,
                            roles: newRoles,
                        })
                    );
                });

                await pipeline.exec();
            }
        }

        await Promise.all([
            db
                .update(roles)
                .set({
                    name: name ?? role.name,
                    key: name?.toLowerCase().replace(/\s/g, "_") ?? role.key,
                    permissions: permissions ?? role.permissions,
                })
                .where(eq(roles.id, params.roleId)),
            updateRoleInCache({
                ...role,
                name: name ?? role.name,
                key: name?.toLowerCase().replace(/\s/g, "_") ?? role.key,
                permissions: permissions ?? role.permissions,
                updatedAt: new Date().toISOString(),
            }),
        ]);

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
