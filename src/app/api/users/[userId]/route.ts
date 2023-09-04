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

        const user = await clerkClient.users.getUser(params.userId);
        if (!user)
            return NextResponse.json({
                code: 404,
                message: "Account doesn't exist",
                data: JSON.stringify(null),
            });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(user),
        });
    } catch (err) {
        handleError(err);
    }
}

export async function PATCH(req: NextRequest, context: UserContext) {
    try {
        const body = await req.json();

        const { params } = userContextSchema.parse(context);

        const [user, target] = await Promise.all([
            currentUser(),
            clerkClient.users.getUser(params.userId),
        ]);

        if (!user)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized",
            });

        if (!target)
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

        await clerkClient.users.updateUser(target.id, {
            username: username || user.username!,
            privateMetadata: {
                role: role || user.privateMetadata.role,
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

export async function PUT(req: NextRequest, context: UserContext) {
    return NextResponse.json({
        code: 501,
        message: "Feature not implemented yet",
    });

    // try {
    //     const body = await req.json();

    //     const authUser = await currentUser();

    //     if (!authUser)
    //         return NextResponse.json({
    //             code: 401,
    //             message: "Unauthorized",
    //         });

    //     const byteCharacters = atob(body.image);
    //     const byteArrays: Uint8Array[] = [];

    //     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    //         const slice = byteCharacters.slice(offset, offset + 512);

    //         const byteNumbers = new Array(slice.length);
    //         for (let i = 0; i < slice.length; i++) {
    //             byteNumbers[i] = slice.charCodeAt(i);
    //         }

    //         const byteArray = new Uint8Array(byteNumbers);
    //         byteArrays.push(byteArray);
    //     }

    //     const blob = new Blob(byteArrays, { type: "image/jpeg" });

    //     const formdata = new FormData();
    //     formdata.append("file", blob, "profile-image.jpg");

    //     await clerkClient.users.updateUserProfileImage(authUser.id, formdata);

    //     return NextResponse.json({
    //         code: 200,
    //         message: "Ok",
    //     });
    // } catch (err) {
    //     handleError(err);
    // }
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
