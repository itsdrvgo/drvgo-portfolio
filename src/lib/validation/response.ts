import { z } from "zod";

export const responseValidator = z.object({
    code: z.union([
        z.literal(200),
        z.literal(201),
        z.literal(202),
        z.literal(204),
        z.literal(400),
        z.literal(401),
        z.literal(402),
        z.literal(403),
        z.literal(404),
        z.literal(405),
        z.literal(409),
        z.literal(429),
        z.literal(500),
        z.literal(502),
    ]),
    message: z.string(),
    data: z.any().optional(),
});

export type ResponseData = z.infer<typeof responseValidator>;
