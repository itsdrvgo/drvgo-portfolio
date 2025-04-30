import fs from "fs/promises";
import path from "path";
import { BLOGS_DIR } from "@/config/const";
import { Blog, blogMetaSchema } from "@/lib/validations";
import matter from "gray-matter";

export async function getBlog(slug: string): Promise<Blog | null> {
    const isFilePresent = await fs
        .stat(path.join(BLOGS_DIR, slug + ".mdx"))
        .then(() => true)
        .catch(() => false);
    if (!isFilePresent) return null;

    const file = await fs.readFile(
        path.join(BLOGS_DIR, slug + ".mdx"),
        "utf-8"
    );

    const { data, content } = matter(file);
    const parsed = blogMetaSchema.safeParse(data);
    if (!parsed.success) return null;

    return {
        meta: parsed.data,
        content,
        slug,
    };
}

export function getReadTime(content: string) {
    const words = content.split(/\s+/g).length;
    const minutes = words / 200;

    return Math.ceil(minutes);
}

export function getAvatar(authors: Blog["meta"]["authors"]) {
    if (authors.length > 1)
        return "https://6kyfi4ef87.ufs.sh/f/tgjx8p7aDhPe7rglvjKikAujgx5TKvRGZ41Vzq7IYE3Sym9s";
    const author = authors[0];
    return (
        author.image ??
        "https://6kyfi4ef87.ufs.sh/f/tgjx8p7aDhPeNbVvZa4UDsSHEIjC7GZY9ABuaeVPkrbivNMF"
    );
}
