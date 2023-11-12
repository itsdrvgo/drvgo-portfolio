"use server";

import { clerkClient } from "@clerk/nextjs";
import { BitFieldPermissions } from "../config/const";
import { checkExistingUsernameInCache } from "../lib/redis/methods/user";
import { hasPermission } from "../lib/utils";
import { ClerkUserWithoutEmail } from "../lib/validation/user";
import { CachedRole, CachedUser } from "../types/cache";

export async function updateUsername({
    id,
    username,
}: {
    id: string;
    username: string;
}) {
    const existingUsername = await checkExistingUsernameInCache(username);
    if (existingUsername) throw new Error("Username already exists!");

    await clerkClient.users.updateUser(id, {
        username,
    });

    return {
        username,
    };
}

export async function updateUserRoles({
    target,
    user,
    updatedRoles,
    allRoles,
}: {
    target: CachedUser;
    user: ClerkUserWithoutEmail;
    updatedRoles: string[];
    allRoles: CachedRole[];
}) {
    const isUserAuthorized = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.ManageUsers | BitFieldPermissions.ManagePages
    );
    if (!isUserAuthorized) throw new Error("You are not authorized!");

    const permissions = allRoles
        .filter((role) => updatedRoles.includes(role.key))
        .reduce((prev, curr) => prev | curr.permissions, 0);

    await clerkClient.users.updateUser(target.id, {
        privateMetadata: {
            roles: updatedRoles,
            permissions,
            strikes: target.strikes,
        },
    });

    return {
        updatedRoles,
    };
}

export async function deleteUser({
    id,
    user,
}: {
    id: string;
    user: ClerkUserWithoutEmail;
}) {
    if (id !== user.id) {
        const isUserAuthorized = hasPermission(
            user.privateMetadata.permissions,
            BitFieldPermissions.ManageUsers | BitFieldPermissions.ManagePages
        );
        if (!isUserAuthorized) throw new Error("You are not authorized!");
    }

    await clerkClient.users.deleteUser(id);

    return {
        id,
    };
}
