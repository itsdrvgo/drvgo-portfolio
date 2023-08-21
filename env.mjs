import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        CLERK_SECRET_KEY: z.string(),
        SVIX_SECRET: z.string(),

        DATABASE_URL: z.string().url(),
        UPSTASH_REDIS_REST_URL: z.string().url(),
        UPSTASH_REDIS_REST_TOKEN: z.string(),

        UPLOADTHING_SECRET: z.string(),
        UPLOADTHING_APP_ID: z.string(),

        MAINTENANCE: z.string(),

        NODE_ENV: z.enum(["development", "test", "production"]),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string(),
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    },
    runtimeEnv: {
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        SVIX_SECRET: process.env.SVIX_SECRET,

        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,

        UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
        UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,

        MAINTENANCE: process.env.MAINTENANCE,

        NODE_ENV: process.env.NODE_ENV,
    },
});
