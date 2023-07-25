import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { signupSchema } from "@/src/lib/validation/auth";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const { email, password, username } = signupSchema.parse(body);

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser)
            return NextResponse.json({
                code: 409,
                message: "Account already exists",
            });

        const supabase = createRouteHandlerClient({ cookies });

        const {
            data: { user: createdUserData },
            error: createUserError,
        } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        });

        if (createUserError)
            return NextResponse.json({
                code: createUserError.status,
                message: createUserError.message,
            });

        await db.insert(users).values({
            email,
            username,
            id: createdUserData?.id!,
        });

        return NextResponse.json({
            code: 201,
            message: "Created",
            data: createdUserData?.id,
        });
    } catch (err) {
        handleError(err);
    }
}
