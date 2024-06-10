import fs from "fs";
import path from "path";
import DefaultAvatar from "@/../public/authors/default.png";
import GroupAvatar from "@/../public/authors/group.png";
import { BLOGS_DIR, IMAGE_EXTENSIONS } from "@/config/const";
import { Blog, blogMetadataSchema } from "@/lib/validation/blog";
import matter from "gray-matter";

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

export function getBlogInfo({ params }: { params: { slug: string } }) {
    const { slug } = params;

    const isFileExists = fs.existsSync(path.join("blogs", slug + ".mdx"));
    if (!isFileExists) return null;

    const markdownFile = fs.readFileSync(
        path.join("blogs", slug + ".mdx"),
        "utf-8"
    );

    const { data: frontMatter, content } = matter(markdownFile);
    const parsedBlogData = blogMetadataSchema.safeParse(frontMatter);

    if (!parsedBlogData.success) return null;

    return {
        frontMatter: parsedBlogData.data,
        slug,
        content,
    };
}

export function getBlogThumbnail(slug: string) {
    const thumbnailExt = IMAGE_EXTENSIONS.find((extension) =>
        fs.existsSync(path.join("public", "thumbnails", slug + "." + extension))
    );
    if (!thumbnailExt) return null;

    const imagePath = "/thumbnails/" + slug + "." + thumbnailExt;
    return imagePath;
}

export function getRelatedBlogs(props: { params: { slug: string } }) {
    const files = fs.readdirSync(path.join(BLOGS_DIR));
    const blogs: Blog[] = [];
    const relatedBlogs: Blog[] = [];

    const currentBlog = getBlogInfo(props);
    if (!currentBlog) return [];
    const currentBlogTags = currentBlog.frontMatter.tags;

    for (const filename of files) {
        const fileContent = fs.readFileSync(
            path.join(BLOGS_DIR, filename),
            "utf-8"
        );

        const { data: frontMatter, content } = matter(fileContent);
        const parsedBlog = blogMetadataSchema.safeParse(frontMatter);
        if (!parsedBlog.success) continue;

        const isCurrentBlog = filename === currentBlog.slug + ".mdx";
        if (isCurrentBlog) continue;

        blogs.push({
            meta: parsedBlog.data,
            slug: filename.replace(".mdx", ""),
            content,
        });

        const hasSimilarTags = currentBlogTags.some((tag) =>
            parsedBlog.data.tags.includes(tag)
        );
        if (!hasSimilarTags) continue;

        relatedBlogs.push({
            meta: parsedBlog.data,
            slug: filename.replace(".mdx", ""),
            content,
        });

        if (relatedBlogs.length === 5) break;
    }

    return !!relatedBlogs.length ? relatedBlogs : blogs.slice(0, 5);
}

export function getAuthorAvatar(authors: string[]) {
    if (authors.length > 1) return GroupAvatar.src;

    const author = authors[0];
    const avatarPath = path.join("public", "authors");

    const avatarExt = IMAGE_EXTENSIONS.find((extension) =>
        fs.existsSync(path.join(avatarPath, author + "." + extension))
    );
    if (!avatarExt) return DefaultAvatar.src;

    const fileBuffer = fs.readFileSync(
        path.join(avatarPath, author + "." + avatarExt)
    );

    const image = Buffer.from(fileBuffer).toString("base64");
    return "data:image/" + avatarExt + ";base64," + image;
}

export function getReadTime(content: string) {
    const words = content.split(/\s+/g).length;
    const minutes = words / 200;

    return Math.ceil(minutes);
}
