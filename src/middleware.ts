import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { BitFieldPermissions } from "./config/const";
import { hasPermission } from "./lib/utils";

const cache = new Map();

const globalRateLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(50, "60s"),
    ephemeralCache: cache,
    analytics: true,
    timeout: 1000,
});

export default authMiddleware({
    ignoredRoutes: [
        "/api/bday",
        "/api/users",
        "/og.webp",
        "/og-blogs.webp",
        "/favicon.ico",
        "/",
        "/bday(.*)",
    ],
    publicRoutes: [
        "/blogs(.*)",
        "/courses(.*)",
        "/music(.*)",
        "/tos(.*)",
        "/privacy(.*)",
        "/auth(.*)",
        "/announcements(.*)",
        "/sso-callback(.*)",
        "/verification(.*)",
        "/api/uploadthing(.*)",
        "/support(.*)",
    ],
    afterAuth: async (auth, req, evt) => {
        const url = new URL(req.nextUrl.origin);

        if (auth.isPublicRoute) {
            if (
                auth.userId &&
                ["/auth", "/callback", "/verification"].includes(
                    req.nextUrl.pathname
                )
            ) {
                url.pathname = "/profile";

                return NextResponse.redirect(url);
            } else if (req.nextUrl.pathname.startsWith("/support"))
                return NextResponse.redirect("https://dsc.gg/drvgo");
            else return NextResponse.next();
        }

        if (!auth.userId) {
            url.pathname = "/auth";
            return NextResponse.redirect(url);
        }

        const user = await clerkClient.users.getUser(auth.userId);
        if (!user) throw new Error("User not found!");

        if (
            (!user.privateMetadata.roles ||
                !user.privateMetadata.roles.length) &&
            !user.privateMetadata.permissions &&
            !user.privateMetadata.strikes
        ) {
            await clerkClient.users.updateUser(auth.userId, {
                privateMetadata: {
                    roles: ["user"],
                    permissions: 1,
                    strikes: 0,
                },
            });
        }

        if (req.nextUrl.pathname.startsWith("/admin")) {
            if (
                hasPermission(
                    user.privateMetadata.permissions,
                    BitFieldPermissions.Administrator
                )
            )
                return NextResponse.next();
            else if (
                hasPermission(
                    user.privateMetadata.permissions,
                    BitFieldPermissions.ViewPrivatePages
                )
            )
                return NextResponse.next();
            else
                return NextResponse.json({
                    code: 403,
                    message: "Forbidden!",
                });
        }

        if (req.nextUrl.pathname === "/profile")
            return NextResponse.redirect(new URL("/profile/settings", req.url));

        if (req.nextUrl.pathname.startsWith("/api")) {
            const { success, pending, limit, reset, remaining } =
                await globalRateLimiter.limit(auth.userId);
            evt.waitUntil(pending);

            const res = success
                ? NextResponse.next()
                : NextResponse.json({
                      code: 429,
                      message: "Too many requests, go slow",
                  });

            res.headers.set("X-RateLimit-Limit", limit.toString());
            res.headers.set("X-RateLimit-Remaining", remaining.toString());
            res.headers.set("X-RateLimit-Reset", reset.toString());
            return res;
        }

        return NextResponse.next();
    },
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/"],
};
