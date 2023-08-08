import { env } from "@/env.mjs";
import { db } from "@/src/lib/drizzle";
import { comments, images, likes, users } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import {
    userDeleteSchema,
    userWebhookSchema,
    WebhookData,
    webhookSchema,
} from "@/src/lib/validation/webhook";
import { SvixHeaders } from "@/src/types";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: NextRequest) {
    const payload = await req.json();

    const headers: SvixHeaders = {
        "svix-id": req.headers.get("svix-id")!,
        "svix-timestamp": req.headers.get("svix-timestamp")!,
        "svix-signature": req.headers.get("svix-signature")!,
    };

    const wh = new Webhook(env.SVIX_SECRET);
    let body: WebhookData;

    try {
        body = wh.verify(JSON.stringify(payload), headers) as WebhookData;
    } catch (err) {
        return NextResponse.json({
            code: 400,
            message: "Bad Request",
        });
    }

    const { type, data } = webhookSchema.parse(body);

    switch (type) {
        case "user.created": {
            try {
                const { id, email_addresses, profile_image_url, username } =
                    userWebhookSchema.parse(data);

                await db.insert(users).values({
                    name: username,
                    id,
                    image: profile_image_url,
                    email: email_addresses[0].email_address,
                });

                return NextResponse.json({
                    code: 201,
                    message: "Ok",
                });
            } catch (err) {
                return handleError(err);
            }
        }

        case "user.updated": {
            const {
                id,
                email_addresses,
                profile_image_url,
                username,
                private_metadata,
            } = userWebhookSchema.parse(data);

            const existingUser = await db.query.users.findFirst({
                where: eq(users.id, id),
            });

            if (!existingUser)
                return NextResponse.json({
                    code: 404,
                    message: "Account doesn't exist",
                });

            if (existingUser.image) {
                await db
                    .delete(images)
                    .where(
                        and(
                            eq(images.url, existingUser.image),
                            eq(images.uploaderId, existingUser.id)
                        )
                    );
            }

            await db
                .update(users)
                .set({
                    email:
                        email_addresses[0].email_address ?? existingUser.email,
                    name: username ?? existingUser.name,
                    image: profile_image_url ?? existingUser.image,
                    role: private_metadata.role ?? existingUser.role,
                })
                .where(eq(users.id, existingUser.id));

            return NextResponse.json({
                code: 200,
                message: "Ok",
                data: JSON.stringify(id),
            });
        }

        case "user.deleted": {
            const { id } = userDeleteSchema.parse(data);

            const existingUser = await db.query.users.findFirst({
                where: eq(users.id, id),
            });

            if (!existingUser)
                return NextResponse.json({
                    code: 404,
                    message: "Account doesn't exist",
                });

            await Promise.all([
                db.delete(users).where(eq(users.id, id)),
                db.delete(comments).where(eq(comments.authorId, id)),
                db.delete(likes).where(eq(likes.userId, id)),
            ]);

            return NextResponse.json({
                code: 200,
                message: "Ok",
                data: JSON.stringify(id),
            });
        }

        default: {
            return NextResponse.json({
                code: 400,
                message: "Bad Request",
            });
        }
    }
}
