import { db } from "@/src/lib/drizzle";
import { accounts, images, sessions, users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { userUpdateSchema } from "@/src/lib/validation/auth";
import { UserContext, userContextSchema } from "@/src/lib/validation/route";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { utapi } from "uploadthing/server";

export async function PATCH(req: NextRequest, context: UserContext) {
    const body = await req.json();

    try {
        const { params } = userContextSchema.parse(context);
        const { username, email, icon } = userUpdateSchema.parse(body);

        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, params.userId),
        });

        if (!existingUser)
            return NextResponse.json({
                code: 404,
                message: "Account doesn't exist",
            });

        if (existingUser.image) {
            await db
                .delete(images)
                .where(
                    and(
                        eq(images.url, existingUser.image),
                        eq(images.uploaderId, existingUser.id)
                    )
                );
        }

        await db.update(users).set({
            email: email ?? existingUser.email,
            name: username ?? existingUser.name,
            image: icon ?? existingUser.image,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: params.userId,
        });
    } catch (err) {
        handleError(err);
    }
}

export async function DELETE(req: NextRequest, context: UserContext) {
    try {
        const { params } = userContextSchema.parse(context);

        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, params.userId),
        });

        if (!existingUser)
            return NextResponse.json({
                code: 404,
                message: "Account doesn't exist",
            });

        await db.delete(users).where(eq(users.id, params.userId));
        await db.delete(accounts).where(eq(accounts.userId, params.userId));
        await db.delete(sessions).where(eq(sessions.userId, params.userId));

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: params.userId,
        });
    } catch (err) {
        handleError(err);
    }
}
