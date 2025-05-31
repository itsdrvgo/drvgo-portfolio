import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "./config/site";

export function middleware(req: NextRequest) {
    switch (req.nextUrl.pathname) {
        case "/support":
            return NextResponse.redirect(siteConfig.links!.Discord!);
        case "/cv":
            return NextResponse.redirect(process.env.CV_URL!);
    }

    return NextResponse.next();
}
