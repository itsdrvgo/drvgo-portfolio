import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { userUpdateSchema } from "@/src/lib/validation/auth";
import { UserContext, userContextSchema } from "@/src/lib/validation/route";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: UserContext) {
    try {
        const { params } = userContextSchema.parse(context);

        const [user, dbUser] = await Promise.all([
            clerkClient.users.getUser(params.userId),
            db.query.users.findFirst({
                where: eq(users.id, params.userId),
            }),
        ]);

        if (!user || !dbUser)
            return NextResponse.json({
                code: 404,
                message: "Account doesn't exist",
            });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(dbUser),
        });
    } catch (err) {
        handleError(err);
    }
}

export async function PATCH(req: NextRequest, context: UserContext) {
    const body = await req.json();

    try {
        const { params } = userContextSchema.parse(context);

        const [authUser, targetUser, dbUser] = await Promise.all([
            currentUser(),
            clerkClient.users.getUser(params.userId),
            db.query.users.findFirst({
                where: eq(users.id, params.userId),
            }),
        ]);

        if (!authUser)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized",
            });

        if (!targetUser || !dbUser)
            return NextResponse.json({
                code: 404,
                message: "Account doesn't exist",
            });

        const { role, username } = userUpdateSchema.parse(body);

        if (username) {
            const existingUsername = await db.query.users.findFirst({
                where: eq(users.username, username),
            });

            if (existingUsername)
                return NextResponse.json({
                    code: 409,
                    message: "Username already exists",
                });
        }

        await clerkClient.users.updateUser(targetUser.id, {
            username: username || dbUser.username,
            privateMetadata: {
                role: role || dbUser.role,
            },
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        handleError(err);
    }
}

export async function DELETE(req: NextRequest, context: UserContext) {
    try {
        const { params } = userContextSchema.parse(context);

        const [authUser, targetUser] = await Promise.all([
            currentUser(),
            clerkClient.users.getUser(params.userId),
        ]);

        if (!authUser)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized",
            });

        if (!targetUser)
            return NextResponse.json({
                code: 404,
                message: "Account doesn't exist",
            });

        await clerkClient.users.deleteUser(targetUser.id);

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        handleError(err);
    }
}
