import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        BASE_URL: z.string().url(),

        CLERK_SECRET_KEY: z.string(),
        SVIX_SECRET: z.string(),

        DATABASE_URL: z.string().url(),
        UPSTASH_REDIS_REST_URL: z.string().url(),
        UPSTASH_REDIS_REST_TOKEN: z.string(),

        UPLOADTHING_SECRET: z.string(),
        UPLOADTHING_APP_ID: z.string(),

        PUSHER_APP_ID: z.string(),
        PUSHER_APP_KEY: z.string(),
        PUSHER_APP_SECRET: z.string(),
        PUSHER_APP_CLUSTER: z.string(),

        NODE_ENV: z.enum(["development", "test", "production"]),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string(),
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),

        NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
        NEXT_PUBLIC_PUSHER_APP_CLUSTER: z.string(),
    },
    runtimeEnv: {
        BASE_URL: process.env.BASE_URL,

        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        SVIX_SECRET: process.env.SVIX_SECRET,

        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

        NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        NEXT_PUBLIC_PUSHER_APP_CLUSTER:
            process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,

        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,

        UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
        UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,

        PUSHER_APP_ID: process.env.PUSHER_APP_ID,
        PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
        PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
        PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,

        NODE_ENV: process.env.NODE_ENV,
    },
});
