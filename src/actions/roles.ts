"use server";

import { clerkClient } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { BitFieldPermissions } from "../config/const";
import { db } from "../lib/drizzle";
import { roles } from "../lib/drizzle/schema";
import { redis } from "../lib/redis";
import {
    addRoleToCache,
    getAllRolesFromCache,
    updateRoleInCache,
} from "../lib/redis/methods/roles";
import { getAllUsersFromCache } from "../lib/redis/methods/user";
import { getAuthorizedUser, hasPermission } from "../lib/utils";
import { ClerkUserWithoutEmail } from "../lib/validation/user";
import { CachedRole } from "../types/cache";

export async function createRole() {
    const user = await getAuthorizedUser(
        BitFieldPermissions.ManageRoles | BitFieldPermissions.ManagePages
    );
    if (!user) throw new Error("You are not authorized!");

    const roleId = nanoid();

    const currentRoles = await getAllRolesFromCache();
    const maxPosition = Math.max(...currentRoles.map((r) => r.position));

    const newRole: Omit<CachedRole, "createdAt" | "updatedAt"> = {
        id: roleId,
        name: "new_role_" + roleId,
        key: "new_role_" + roleId,
        permissions: 1,
        position: maxPosition + 1,
    };

    await Promise.all([
        db.insert(roles).values(newRole),
        addRoleToCache({
            ...newRole,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }),
    ]);

    return {
        role: {
            ...newRole,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    };
}

export async function updateRoles({
    rolesToBeUpdated,
    initialRoles,
    user,
}: {
    rolesToBeUpdated: {
        id: string;
        position: number;
    }[];
    initialRoles: CachedRole[];
    user: ClerkUserWithoutEmail;
}) {
    const isUserAuthorized = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.ManageRoles | BitFieldPermissions.ManagePages
    );
    if (!isUserAuthorized)
        throw new Error("You don't have permission to update roles!");

    let updatedRoles: CachedRole[] = [];

    const deletedRoles = initialRoles.filter(
        (r) => !rolesToBeUpdated.find((x) => x.id === r.id)
    );

    const pipeline = redis.pipeline();

    if (deletedRoles.length > 0) {
        deletedRoles.forEach(async (role) => {
            pipeline.del(`role:${role.id}`);
            await db.delete(roles).where(eq(roles.id, role.id));
        });

        rolesToBeUpdated.forEach(async (role) => {
            const roleToBeUpdated = initialRoles.find((r) => r.id === role.id);
            if (!roleToBeUpdated) return;

            updatedRoles.push({
                ...roleToBeUpdated,
                position: role.position,
            });
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
        rolesToBeUpdated.forEach(async (role) => {
            const roleToBeUpdated = initialRoles.find((r) => r.id === role.id);
            if (!roleToBeUpdated) return;

            updatedRoles.push({
                ...roleToBeUpdated,
                position: role.position,
            });
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

    return {
        roles: updatedRoles,
    };
}

export async function updateRole({
    initialRoles,
    user,
    updatedRole,
    role,
}: {
    initialRoles: CachedRole[];
    user: ClerkUserWithoutEmail;
    updatedRole: {
        name?: string;
        permissions?: number;
    };
    role: CachedRole;
}) {
    const { name, permissions } = updatedRole;

    const isUserAuthorized = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.ManageRoles | BitFieldPermissions.ManagePages
    );
    if (!isUserAuthorized)
        throw new Error("You don't have permission to update roles!");

    const users = await getAllUsersFromCache();
    const usersWithRole = users.filter((x) => x.roles.includes(role.key));

    if (usersWithRole.length > 0) {
        if (permissions && permissions !== role.permissions) {
            const pipeline = redis.pipeline();

            usersWithRole.map(async (u) => {
                const accountRoles = u.roles.map((x) => {
                    const r = initialRoles.find((y) => y.key === x);
                    if (!r) return null;
                    return r;
                });

                const accountHighestRole = accountRoles.reduce((prev, curr) => {
                    if (!prev) return curr;
                    if (!curr) return prev;
                    return prev.position > curr.position ? curr : prev;
                }, null);
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
                    x === role.key ? name.toLowerCase().replace(/\s/g, "_") : x
                );

                await clerkClient.users.updateUserMetadata(u.id, {
                    privateMetadata: {
                        permissions: u.permissions,
                        roles: newRoles,
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
                permissions: permissions ?? role.permissions,
                key: name?.toLowerCase().replace(/\s/g, "_") ?? role.key,
            })
            .where(eq(roles.id, role.id)),
        updateRoleInCache({
            ...role,
            name: name ?? role.name,
            permissions: permissions ?? role.permissions,
            key: name?.toLowerCase().replace(/\s/g, "_") ?? role.key,
            updatedAt: new Date().toISOString(),
        }),
    ]);

    return {
        role: {
            ...role,
            name: name ?? role.name,
            permissions: permissions ?? role.permissions,
            key: name?.toLowerCase().replace(/\s/g, "_") ?? role.key,
            updatedAt: new Date().toISOString(),
        },
    };
}
