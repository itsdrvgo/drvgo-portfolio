import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { userUpdateSchema } from "@/src/lib/validation/auth";
import { UserContext, userContextSchema } from "@/src/lib/validation/route";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const parsedUserSchema = z.object({
    id: z.string(),
    username: z.string(),
    image: z.string().nullable(),
    createdAt: z.date(),
    account: z.object({
        roles: z.array(z.string()),
        permissions: z.number(),
        strikes: z.number(),
    }),
});

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

        const parsedUser = parsedUserSchema.parse(user);

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
            roles: userRoles,
            username,
            strikes,
        } = userUpdateSchema.parse(body);

        const roles = await db.query.roles.findMany();

        if ((userRoles && userRoles.length) || strikes) {
            const user = await getAuthorizedUser(
                BitFieldPermissions.ManageUsers |
                    BitFieldPermissions.ManagePages
            );
            if (!user)
                return NextResponse.json({
                    code: 403,
                    message: "Unauthorized!",
                });

            const target = await clerkClient.users.getUser(params.userId);
            if (!target)
                return NextResponse.json({
                    code: 404,
                    message: "Account doesn't exist!",
                });

            let permissions = 0;

            if (userRoles && userRoles.length) {
                permissions = roles
                    .filter((role) => userRoles.includes(role.key))
                    .reduce((acc, role) => acc | role.permissions, 0);
            }

            await clerkClient.users.updateUserMetadata(target.id, {
                privateMetadata: {
                    roles:
                        userRoles && userRoles.length
                            ? userRoles
                            : target.privateMetadata.roles,
                    permissions:
                        permissions !== 0
                            ? permissions
                            : target.privateMetadata.permissions,
                    strikes: strikes || target.privateMetadata.strikes,
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

            const existingUsername = await db.query.users.findFirst({
                where: eq(users.username, username),
            });
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
