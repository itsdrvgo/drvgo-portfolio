import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "./config/site";

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === "/support")
        return NextResponse.redirect(siteConfig.links?.discord!);
    else return NextResponse.next();
}
