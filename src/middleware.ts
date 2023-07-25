import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
        error: sError,
    } = await supabase.auth.getSession();
    const {
        data: { user },
        error: uError,
    } = await supabase.auth.getUser();
    const url = new URL(req.nextUrl.origin);

    return res;
}

export const config = {
    matcher: [
        "/",
        "/signin",
        "/signup",
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
