import { env } from "@/env.mjs";
import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { User } from "./lib/drizzle/schema";

const cache = new Map();

const globalRateLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(50, "60s"),
    ephemeralCache: cache,
    analytics: true,
    timeout: 1000,
});

const viewsRateLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(5, "60s"),
    ephemeralCache: cache,
    analytics: true,
    timeout: 1000,
});

export default authMiddleware({
    publicRoutes: [
        "/blogs(.*)",
        "/courses(.*)",
        "/terms(.*)",
        "/privacy(.*)",
        "/signin(.*)",
        "/signup(.*)",
        "/sso-callback(.*)",
        "/verification(.*)",
        "/api/uploadthing(.*)",
        "/support(.*)",
    ],
    async afterAuth(auth, req, evt) {
        const url = new URL(req.nextUrl.origin);
        const identifier = auth.userId || req.ip || "127.0.0.1";

        if (
            env.MAINTENANCE === "0" &&
            req.nextUrl.pathname !== "/maintenance"
        ) {
            url.pathname = "/maintenance";
            return NextResponse.redirect(url);
        }

        if (auth.isPublicRoute) {
            if (
                auth.userId &&
                ["/signin", "/signup", "/callback", "/verification"].includes(
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
            if (req.nextUrl.pathname.startsWith("/api"))
                return NextResponse.next();

            url.pathname = "/signin";
            return NextResponse.redirect(url);
        } else {
            const user = await clerkClient.users.getUser(auth.userId);
            if (!user) throw new Error("User not found.");

            if (!user.privateMetadata.role)
                await clerkClient.users.updateUserMetadata(auth.userId, {
                    privateMetadata: {
                        role: "user" satisfies User["role"],
                    },
                });

            if (
                req.nextUrl.pathname.startsWith("/admin") &&
                user.privateMetadata.role === "user"
            )
                return NextResponse.json({
                    code: 403,
                    message: "Forbidden",
                });

            if (req.nextUrl.pathname === "/profile")
                return NextResponse.redirect(
                    new URL("/profile/settings", req.url)
                );

            if (req.nextUrl.pathname.startsWith("/api")) {
                if (req.nextUrl.pathname === "/api/blogs/views") {
                    const { success, pending, limit, reset, remaining } =
                        await viewsRateLimiter.limit(identifier);
                    evt.waitUntil(pending);

                    const res = success
                        ? NextResponse.next()
                        : NextResponse.json({
                              code: 429,
                              message: "Too many view requests",
                          });

                    res.headers.set("X-RateLimit-Limit", limit.toString());
                    res.headers.set(
                        "X-RateLimit-Remaining",
                        remaining.toString()
                    );
                    res.headers.set("X-RateLimit-Reset", reset.toString());
                    return res;
                } else {
                    const { success, pending, limit, reset, remaining } =
                        await globalRateLimiter.limit(identifier);
                    evt.waitUntil(pending);

                    const res = success
                        ? NextResponse.next()
                        : NextResponse.json({
                              code: 429,
                              message: "Too many requests, go slow",
                          });

                    res.headers.set("X-RateLimit-Limit", limit.toString());
                    res.headers.set(
                        "X-RateLimit-Remaining",
                        remaining.toString()
                    );
                    res.headers.set("X-RateLimit-Reset", reset.toString());
                    return res;
                }
            }
        }

        return NextResponse.next();
    },
    ignoredRoutes: [
        "/api/auth",
        "/api/users",
        "/og.jpg",
        "/og-blogs.png",
        "/favicon.ico",
        "/",
    ],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)"],
};
