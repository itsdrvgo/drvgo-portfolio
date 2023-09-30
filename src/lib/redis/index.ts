import { env } from "@/env.mjs";
import { Redis } from "@upstash/redis";

const redisUrl = env.UPSTASH_REDIS_REST_URL;
const redisToken = env.UPSTASH_REDIS_REST_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smembers";

export const redis = Redis.fromEnv();

export async function fetchRedis(
    command: Command,
    ...args: (string | number)[]
) {
    const commandUrl = `${redisUrl}/${command}/${args.join("/")}`;

    const response = await fetch(commandUrl, {
        headers: {
            Authorization: `Bearer ${redisToken}`,
        },
        cache: "no-store",
    });

    if (!response.ok)
        throw new Error(
            `Error executing Redis command: ${response.statusText}`
        );

    const data = await response.json();
    return data.result;
}
