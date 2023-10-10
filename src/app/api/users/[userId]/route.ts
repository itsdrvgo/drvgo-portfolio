import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { getAllRolesFromCache } from "@/src/lib/redis/methods/roles";
import {
    checkExistingUsernameInCache,
    getUserFromCache,
} from "@/src/lib/redis/methods/user";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { userUpdateSchema } from "@/src/lib/validation/auth";
import { UserContext, userContextSchema } from "@/src/lib/validation/route";
import { CachedUser } from "@/src/types/cache";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: UserContext) {
    try {
        const { params } = userContextSchema.parse(context);

        const user = await db.query.users.findFirst({
            where: eq(users.id, params.userId),
            with: {
                account: true,
            },
        });
        if (!user)
            return NextResponse.json({
                code: 404,
                message: "Account doesn't exist!",
                data: JSON.stringify(null),
            });

        const parsedUser: Omit<CachedUser, "email" | "updatedAt"> = {
            id: user.id,
            username: user.username,
            image: user.image,
            createdAt: user.createdAt.toISOString(),
            permissions: user.account.permissions,
            roles: user.account.roles,
            strikes: user.account.strikes,
        };

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(parsedUser),
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function PATCH(req: NextRequest, context: UserContext) {
    try {
        const body = await req.json();

        const { params } = userContextSchema.parse(context);

        const {
            roles: targetRoles,
            username,
            strikes,
        } = userUpdateSchema.parse(body);

        const roles = await getAllRolesFromCache();

        if ((targetRoles && targetRoles.length) || strikes) {
            const [user, target] = await Promise.all([
                getAuthorizedUser(
                    BitFieldPermissions.ManageUsers |
                        BitFieldPermissions.ManagePages
                ),
                getUserFromCache(params.userId),
            ]);

            if (!user)
                return NextResponse.json({
                    code: 401,
                    message: "Unauthorized!",
                });

            if (!target)
                return NextResponse.json({
                    code: 404,
                    message: "Account doesn't exist!",
                });

            let permissions = 0;

            if (targetRoles && targetRoles.length) {
                permissions = roles
                    .filter((role) => targetRoles.includes(role.key))
                    .reduce((acc, role) => acc | role.permissions, 0);
            }

            await clerkClient.users.updateUserMetadata(target.id, {
                privateMetadata: {
                    roles:
                        targetRoles && targetRoles.length
                            ? targetRoles
                            : target.roles,
                    permissions:
                        permissions !== 0 ? permissions : target.permissions,
                    strikes: strikes || target.strikes,
                },
            });

            return NextResponse.json({
                code: 200,
                message: "Ok",
            });
        }

        if (username) {
            const user = await currentUser();
            if (!user)
                return NextResponse.json({
                    code: 401,
                    message: "Unauthorized!",
                });

            const existingUsername =
                await checkExistingUsernameInCache(username);
            if (existingUsername)
                return NextResponse.json({
                    code: 409,
                    message: "Username already exists!",
                });

            await clerkClient.users.updateUser(user.id, {
                username,
            });

            return NextResponse.json({
                code: 200,
                message: "Ok",
            });
        }

        return NextResponse.json({
            code: 400,
            message: "Bad Request!",
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(req: NextRequest, context: UserContext) {
    try {
        const body = await req.formData();

        const { params } = userContextSchema.parse(context);

        const user = await currentUser();
        if (!user)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized!",
            });

        if (user.id !== params.userId)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const image = body.get("image");
        if (!image)
            return NextResponse.json({
                code: 400,
                message: "Bad Request!",
            });

        await clerkClient.users.updateUserProfileImage(params.userId, {
            file: image as File,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(req: NextRequest, context: UserContext) {
    try {
        const { params } = userContextSchema.parse(context);

        const [user, target] = await Promise.all([
            currentUser(),
            clerkClient.users.getUser(params.userId),
        ]);

        if (!user)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized!",
            });

        if (!target)
            return NextResponse.json({
                code: 404,
                message: "Account doesn't exist!",
            });

        if (user.id !== target.id) {
            const authorizedUser = await getAuthorizedUser(
                BitFieldPermissions.ManageUsers |
                    BitFieldPermissions.ManagePages
            );
            if (!authorizedUser)
                return NextResponse.json({
                    code: 403,
                    message: "Unauthorized!",
                });

            await clerkClient.users.deleteUser(target.id);
        } else await clerkClient.users.deleteUser(target.id);

        return NextResponse.json({
            code: 204,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
