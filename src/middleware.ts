import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ipAddress } from "@vercel/edge";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

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

export default withAuth(async function middleware(req, evt) {
    const token = await getToken({ req });
    const isAuth = !!token;
    if (!isAuth) return NextResponse.redirect(new URL("/", req.url));

    const reqIp = ipAddress(req) ?? "127.0.0.1";

    if (req.nextUrl.pathname === "/profile")
        return NextResponse.redirect(new URL("/profile/settings", req.url));

    if (req.nextUrl.pathname.startsWith("/api")) {
        if (req.nextUrl.pathname.startsWith("/api/blogs/views")) {
            const { success, pending, limit, reset, remaining } =
                await viewsRateLimiter.limit(reqIp);
            evt.waitUntil(pending);

            const res = success
                ? NextResponse.next()
                : NextResponse.json({
                      code: 429,
                      message: "Too many view requests",
                  });

            res.headers.set("X-RateLimit-Limit", limit.toString());
            res.headers.set("X-RateLimit-Remaining", remaining.toString());
            res.headers.set("X-RateLimit-Reset", reset.toString());
            return res;
        } else {
            const { success, pending, limit, reset, remaining } =
                await globalRateLimiter.limit(reqIp);
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
    }
});

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|api/auth|api/uploadthing|signin|signup|privacy|tos|blogs|og.jpg).*)(.+)",
    ],
};
