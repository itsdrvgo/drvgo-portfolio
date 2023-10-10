import { CachedUser } from "@/src/types/cache";
import { eq } from "drizzle-orm";
import { redis } from "..";
import { db } from "../../drizzle";
import { users } from "../../drizzle/schema";

export async function addUserToCache(user: CachedUser) {
    await redis.set(`user:${user.id}`, JSON.stringify(user));
}

export async function updateUserInCache(user: CachedUser) {
    await redis.set(`user:${user.id}`, JSON.stringify(user));
}

export async function deleteUserFromCache(id: string) {
    await redis.del(`user:${id}`);
}

export async function getUserFromCache(id: string) {
    const cachedUser = await redis.get<CachedUser | null>(`user:${id}`);
    if (!cachedUser) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
            with: {
                account: true,
            },
        });
        if (!user) return null;

        const cachableUser: CachedUser = {
            id: user.id,
            username: user.username,
            image: user.image,
            createdAt: user.createdAt.toISOString(),
            email: user.email,
            permissions: user.account.permissions,
            roles: user.account.roles,
            strikes: user.account.strikes,
            updatedAt: user.updatedAt.toISOString(),
        };

        await addUserToCache(cachableUser);
        return cachableUser;
    }

    return cachedUser;
}

export async function getAllUsersFromCache() {
    const keys = await redis.keys("user:*");
    if (!keys.length) {
        const users = await db.query.users.findMany({
            with: {
                account: true,
            },
        });
        if (!users.length) return [];

        const cachableUsers: CachedUser[] = users.map((user) => ({
            id: user.id,
            username: user.username,
            image: user.image,
            createdAt: user.createdAt.toISOString(),
            email: user.email,
            permissions: user.account.permissions,
            roles: user.account.roles,
            strikes: user.account.strikes,
            updatedAt: user.updatedAt.toISOString(),
        }));

        const pipeline = redis.pipeline();
        cachableUsers.forEach((user) => {
            pipeline.set(`user:${user.id}`, JSON.stringify(user));
            pipeline.sadd("usernames", user.username);
        });

        await pipeline.exec();
        return cachableUsers;
    }

    const users = await redis.mget<CachedUser[]>(...keys);
    return users;
}

export async function addUsernameToCache(username: string) {
    await redis.sadd("usernames", username);
}

export async function updateUsernameInCache(
    oldUsername: string,
    newUsername: string
) {
    const pipeline = redis.pipeline();
    pipeline.srem("usernames", oldUsername);
    pipeline.sadd("usernames", newUsername);
    await pipeline.exec();
}

export async function deleteUsernameFromCache(username: string) {
    await redis.srem("usernames", username);
}

export async function checkExistingUsernameInCache(username: string) {
    const existingUsernamesRaw = await redis.smembers<string[][]>("usernames");
    const existingUsernames = existingUsernamesRaw.flatMap(
        (existingUsername) => existingUsername
    );
    return existingUsernames.includes(username);
}
