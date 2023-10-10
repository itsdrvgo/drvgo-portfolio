import { CachedRole } from "@/src/types/cache";
import { eq } from "drizzle-orm";
import { redis } from "..";
import { db } from "../../drizzle";
import { roles } from "../../drizzle/schema";

export async function addRoleToCache(role: CachedRole) {
    await redis.set(`role:${role.id}`, JSON.stringify(role));
}

export async function updateRoleInCache(role: CachedRole) {
    await redis.set(`role:${role.id}`, JSON.stringify(role));
}

export async function deleteRoleFromCache(id: string) {
    await redis.del(`role:${id}`);
}

export async function getRoleFromCache(id: string) {
    const cachedRole = await redis.get<CachedRole | null>(`role:${id}`);
    if (!cachedRole) {
        const role = await db.query.roles.findFirst({
            where: eq(roles.id, id),
        });
        if (!role) return null;

        const cachableRole: CachedRole = {
            id: role.id,
            name: role.name,
            key: role.key,
            position: role.position,
            permissions: role.permissions,
            createdAt: role.createdAt.toISOString(),
            updatedAt: role.updatedAt.toISOString(),
        };

        await addRoleToCache(cachableRole);
        return cachableRole;
    }

    return cachedRole;
}

export async function getAllRolesFromCache() {
    const keys = await redis.keys("role:*");
    if (!keys.length) {
        const roles = await db.query.roles.findMany();
        const cachableRoles = roles.map((role) => ({
            id: role.id,
            name: role.name,
            key: role.key,
            position: role.position,
            permissions: role.permissions,
            createdAt: role.createdAt.toISOString(),
            updatedAt: role.updatedAt.toISOString(),
        }));

        const pipeline = redis.pipeline();
        cachableRoles.forEach((role) => {
            pipeline.set(`role:${role.id}`, JSON.stringify(role));
        });

        await pipeline.exec();
        return cachableRoles;
    }

    const cachedRoles = await redis.mget<CachedRole[]>(...keys);
    return cachedRoles;
}
