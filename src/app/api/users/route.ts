import { env } from "@/env.mjs";
import { db } from "@/src/lib/drizzle";
import {
    accounts,
    commentLoves,
    comments,
    images,
    likes,
    notifications,
    projects,
    users,
} from "@/src/lib/drizzle/schema";
import {
    addUsernameToCache,
    addUserToCache,
    deleteUserFromCache,
    deleteUsernameFromCache,
    getUserFromCache,
    updateUserInCache,
    updateUsernameInCache,
} from "@/src/lib/redis/methods/user";
import { handleError } from "@/src/lib/utils";
import {
    userDeleteSchema,
    userWebhookSchema,
    WebhookData,
    webhookSchema,
} from "@/src/lib/validation/webhook";
import { SvixHeaders } from "@/src/types";
import { eq, or } from "drizzle-orm";
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
            message: "Bad Request!",
        });
    }

    const { type, data } = webhookSchema.parse(body);

    switch (type) {
        case "user.created": {
            try {
                const { id, email_addresses, profile_image_url, username } =
                    userWebhookSchema
                        .omit({
                            private_metadata: true,
                        })
                        .parse(data);

                await Promise.all([
                    db.insert(users).values({
                        username,
                        id,
                        image: profile_image_url,
                        email: email_addresses[0].email_address,
                    }),
                    db.insert(accounts).values({
                        id,
                        permissions: 1,
                        roles: ["user"],
                        strikes: 0,
                    }),
                    addUserToCache({
                        id,
                        username,
                        image: profile_image_url,
                        email: email_addresses[0].email_address,
                        permissions: 1,
                        roles: ["user"],
                        strikes: 0,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }),
                    addUsernameToCache(username),
                ]);

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

            const existingUser = await getUserFromCache(id);
            if (!existingUser)
                return NextResponse.json({
                    code: 404,
                    message: "Account doesn't exist!",
                });

            await Promise.all([
                db
                    .update(users)
                    .set({
                        email:
                            email_addresses[0].email_address ??
                            existingUser.email,
                        username: username ?? existingUser.username,
                        image: profile_image_url ?? existingUser.image,
                    })
                    .where(eq(users.id, existingUser.id)),
                db
                    .update(accounts)
                    .set({
                        permissions:
                            private_metadata.permissions ??
                            existingUser.permissions,
                        roles: private_metadata.roles ?? existingUser.roles,
                        strikes:
                            private_metadata.strikes ?? existingUser.strikes,
                    })
                    .where(eq(accounts.id, existingUser.id)),
                updateUserInCache({
                    id,
                    username: username ?? existingUser.username,
                    image: profile_image_url ?? existingUser.image,
                    email:
                        email_addresses[0].email_address ?? existingUser.email,
                    permissions:
                        private_metadata.permissions ??
                        existingUser.permissions,
                    roles: private_metadata.roles ?? existingUser.roles,
                    strikes: private_metadata.strikes ?? existingUser.strikes,
                    createdAt: existingUser.createdAt,
                    updatedAt: new Date().toISOString(),
                }),
                username !== existingUser.username &&
                    updateUsernameInCache(existingUser.username, username),
            ]);

            return NextResponse.json({
                code: 200,
                message: "Ok",
            });
        }

        case "user.deleted": {
            const { id } = userDeleteSchema.parse(data);

            const existingUser = await getUserFromCache(id);
            if (!existingUser)
                return NextResponse.json({
                    code: 404,
                    message: "Account doesn't exist!",
                });

            await Promise.all([
                db.delete(users).where(eq(users.id, id)),
                db.delete(accounts).where(eq(accounts.id, id)),
                db.delete(comments).where(eq(comments.authorId, id)),
                db.delete(images).where(eq(images.uploaderId, id)),
                db.delete(likes).where(eq(likes.userId, id)),
                db
                    .delete(notifications)
                    .where(
                        or(
                            eq(notifications.userId, id),
                            eq(notifications.notifierId, id)
                        )
                    ),
                db.delete(commentLoves).where(eq(commentLoves.userId, id)),
                db.delete(projects).where(eq(projects.purchaserId, id)),
                deleteUserFromCache(id),
                deleteUsernameFromCache(existingUser.username),
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
                message: "Bad Request!",
            });
        }
    }
}
