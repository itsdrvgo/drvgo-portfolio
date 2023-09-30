import { env } from "@/env.mjs";
import PusherServer from "pusher";

export const pusherServer = new PusherServer({
    appId: env.PUSHER_APP_ID,
    key: env.PUSHER_APP_KEY,
    secret: env.PUSHER_APP_SECRET,
    cluster: env.PUSHER_APP_CLUSTER,
    useTLS: true,
});
