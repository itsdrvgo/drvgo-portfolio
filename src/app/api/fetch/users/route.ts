import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { redis } from "@/src/lib/redis";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const user = await getAuthorizedUser(BitFieldPermissions.Administrator);
        if (!user)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized",
            });

        const users = await db.query.users.findMany({
            with: {
                account: true,
            },
        });

        const pipeline = redis.pipeline();
        users
            .map((user) => ({
                id: user.id,
                username: user.username,
                image: user.image,
                createdAt: user.createdAt.toISOString(),
                email: user.email,
                permissions: user.account.permissions,
                roles: user.account.roles,
                strikes: user.account.strikes,
                updatedAt: user.updatedAt.toISOString(),
            }))
            .forEach((user) => {
                pipeline.set(`user:${user.id}`, JSON.stringify(user));
                pipeline.sadd("usernames", user.username);
            });

        await pipeline.exec();

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(users),
        });
    } catch (err) {
        return handleError(err);
    }
}
