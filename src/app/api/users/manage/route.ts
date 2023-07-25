import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { loginSchema } from "@/src/lib/validation/auth";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const { email, password } = loginSchema.parse(body);

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!existingUser)
            return NextResponse.json({
                code: 404,
                message: "Account doesn't exist",
            });

        const supabase = createRouteHandlerClient({ cookies });

        const {
            data: { user: signedInUserData },
            error: signInError,
        } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError)
            return NextResponse.json({
                code: signInError.status,
                message: signInError.message,
            });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: signedInUserData?.user_metadata.username,
        });
    } catch (err) {
        handleError(err);
    }
}
