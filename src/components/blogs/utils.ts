import fs from "fs";
import path from "path";
import DefaultAvatar from "@/public/authors/default.png";
import { IMAGE_EXTENSIONS } from "@/src/config/const";

export function getAuthorAvatars(authors: string[]) {
    const avatarPath = path.join("public", "authors");

    return authors.map((author) => {
        const avatarExt = IMAGE_EXTENSIONS.find((extension) =>
            fs.existsSync(path.join(avatarPath, author + "." + extension))
        );
        if (!avatarExt) return DefaultAvatar.src;

        const fileBuffer = fs.readFileSync(
            path.join(avatarPath, author + "." + avatarExt)
        );

        const image = Buffer.from(fileBuffer).toString("base64");
        return "data:image/" + avatarExt + ";base64," + image;
    });
}
