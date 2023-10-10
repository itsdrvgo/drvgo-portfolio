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

        const roles = await db.query.roles.findMany();

        const pipeline = redis.pipeline();
        roles
            .map((role) => ({
                id: role.id,
                name: role.name,
                key: role.key,
                position: role.position,
                permissions: role.permissions,
                createdAt: role.createdAt.toISOString(),
                updatedAt: role.updatedAt?.toISOString() ?? null,
            }))
            .forEach((role) => {
                pipeline.set(`role:${role.id}`, JSON.stringify(role));
            });

        await pipeline.exec();

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(roles),
        });
    } catch (err) {
        return handleError(err);
    }
}
