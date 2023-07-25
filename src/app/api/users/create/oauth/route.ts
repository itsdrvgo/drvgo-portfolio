import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import { oauthSchema } from "@/src/lib/validation/auth";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator";

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const { code } = oauthSchema.parse(body);

        const supabase = createRouteHandlerClient({ cookies });

        const { data, error: signInError } =
            await supabase.auth.signInWithOAuth({
                provider: code,
            });

        if (signInError)
            return NextResponse.json({
                code: signInError.status,
                message: signInError.message,
            });

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError)
            return NextResponse.json({
                code: userError.status,
                message: userError.message,
            });

        const uniqueUsername = uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            style: "lowerCase",
            length: 8,
        });

        await db.insert(users).values({
            email: user?.email!,
            username: user?.user_metadata?.username ?? uniqueUsername,
            id: user?.id!,
        });

        return NextResponse.json({
            code: 201,
            message: "Created",
            data: user?.user_metadata?.username ?? uniqueUsername,
        });
    } catch (err) {
        handleError(err);
    }
}
