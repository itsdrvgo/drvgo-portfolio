import { env } from "@/env.mjs";
import PusherClient from "pusher-js";

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
    cluster: env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
});
