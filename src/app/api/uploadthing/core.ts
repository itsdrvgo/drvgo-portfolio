import { BitFieldPermissions } from "@/src/config/const";
import { getAuthorizedUser } from "@/src/lib/utils";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const customFileRouter = {
    blogThumbnail: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
        .middleware(async () => {
            const user = await getAuthorizedUser(
                BitFieldPermissions.ManageBlogs |
                    BitFieldPermissions.ManagePages
            );
            if (!user) throw new Error("Unauthorized!");

            return { userId: user.id };
        })
        .onUploadError((err) => {
            console.error(err);
            throw err;
        })
        .onUploadComplete(({ metadata, file }) => {
            console.log(metadata, file);
        }),

    announcementThumbnail: f({
        image: { maxFileSize: "2MB", maxFileCount: 1 },
    })
        .middleware(async () => {
            const user = await getAuthorizedUser(
                BitFieldPermissions.ManagePages
            );
            if (!user) throw new Error("Unauthorized!");

            return { userId: user.id };
        })
        .onUploadError((err) => {
            console.error(err);
            throw err;
        })
        .onUploadComplete(({ metadata, file }) => {
            console.log(metadata, file);
        }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;
