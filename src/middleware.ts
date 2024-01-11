import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === "/support")
        return NextResponse.redirect("https://dsc.gg/drvgo");
    else return NextResponse.next();
}
