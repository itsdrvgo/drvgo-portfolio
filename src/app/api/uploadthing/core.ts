import { db } from "@/src/lib/drizzle";
import { images } from "@/src/lib/drizzle/schema";
import { getAuthorizedUser } from "@/src/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { utapi } from "uploadthing/server";

const f = createUploadthing();

export const customFileRouter = {
    profilePicture: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const user = await currentUser();
            if (!user) throw new Error("Unauthorized!");

            if (user.imageUrl) {
                const icon = await db.query.images.findFirst({
                    where: and(
                        eq(images.url, user.imageUrl),
                        eq(images.uploaderId, user.id)
                    ),
                });

                if (icon) await utapi.deleteFiles(icon.key);
            }

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db.insert(images).values({
                key: file.key,
                uploaderId: metadata.userId,
                url: file.url,
            });
        }),
    blogThumbnail: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
        .middleware(async () => {
            const user = await getAuthorizedUser();
            if (!user) throw new Error("Unauthorized!");

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log(metadata, file);
        }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;
