import fs from "fs";
import path from "path";
import DefaultAvatar from "@/public/authors/default.png";
import GeneralShell from "@/src/components/global/shells/general-shell";
import { IMAGE_EXTENSIONS } from "@/src/config/const";
import { cn } from "@/src/lib/utils";
import { Blog, blogMetadataSchema } from "@/src/lib/validation/blog";
import { Avatar, Tooltip } from "@nextui-org/react";
import { format } from "date-fns";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";

const BLOGS_DIR = "blogs";

function Page() {
    const files = fs.readdirSync(path.join(BLOGS_DIR));
    const blogs: Blog[] = [];

    for (const filename of files) {
        const fileContent = fs.readFileSync(
            path.join(BLOGS_DIR, filename),
            "utf-8"
        );

        const { data: frontMatter, content } = matter(fileContent);
        const parsedBlog = blogMetadataSchema.safeParse(frontMatter);

        if (!parsedBlog.success) continue;

        blogs.push({
            meta: parsedBlog.data,
            slug: filename.replace(".mdx", ""),
            content,
        });
    }

    return (
        <GeneralShell>
            <div className="space-y-3 text-center">
                <h2 className="text-3xl font-bold md:text-5xl">Blogs</h2>
                <p className="text-white/60">
                    I write about my experiences with music, and programming.
                </p>
            </div>

            <div className="grid gap-2 py-2 md:grid-cols-3 md:gap-4">
                {blogs
                    .sort(
                        (a, b) =>
                            new Date(b.meta.date).getTime() -
                            new Date(a.meta.date).getTime()
                    )
                    .map(
                        (blog) =>
                            blog && <BlogCard key={blog.slug} blog={blog} />
                    )}
            </div>
        </GeneralShell>
    );
}

export default Page;

function BlogCard({ blog }: { blog: Blog }) {
    const blogAuthors = blog.meta.authors;

    const authorAvatars = getAuthorAvatars(
        blogAuthors
            .slice(0, 2)
            .map((author) => author.name.toLowerCase().replace(" ", "-"))
    );

    const thumbnailExt = IMAGE_EXTENSIONS.find((extension) =>
        fs.existsSync(
            path.join("public", "thumbnails", blog.slug + "." + extension)
        )
    );
    if (!thumbnailExt) return null;

    const avatarPath = path.join("public", "thumbnails");

    const imageBuffer = fs.readFileSync(
        path.join(avatarPath, blog.slug + "." + thumbnailExt)
    );

    const base64Thumbnail = Buffer.from(imageBuffer).toString("base64");
    const thumbnail =
        "data:image/" + thumbnailExt + ";base64," + base64Thumbnail;

    return (
        <Link
            href={"/blogs/" + blog.slug}
            className="group relative aspect-[3/2] overflow-hidden rounded-lg border border-white/15 shadow-md"
        >
            <Image
                src={thumbnail}
                alt={blog.meta.title}
                height={1920}
                width={1080}
                className="size-full object-cover"
            />

            <div className="absolute bottom-0 left-0 flex size-full flex-col justify-end gap-2 bg-gradient-to-t from-black/80 to-transparent p-2">
                <h3 className="text-lg font-bold md:text-xl">
                    {blog.meta.title}
                </h3>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {authorAvatars.map((avatar, index) => (
                            <Tooltip
                                key={index}
                                content={blogAuthors[index].name}
                            >
                                <Avatar
                                    src={avatar}
                                    alt={blog.meta.title}
                                    classNames={{
                                        base: cn(
                                            index !== 0 && "-ml-3",
                                            "!size-6 border border-white/20"
                                        ),
                                    }}
                                    showFallback
                                    size="sm"
                                />
                            </Tooltip>
                        ))}

                        {blogAuthors.length > 2 && (
                            <Tooltip
                                content={blogAuthors
                                    .slice(2)
                                    .map((author) => author.name)
                                    .join(", ")}
                            >
                                <p className="text-white/60">
                                    +{blogAuthors.length - 2}
                                </p>
                            </Tooltip>
                        )}
                    </div>

                    <p className="text-sm font-light text-white/60">
                        {format(new Date(blog.meta.date), "do MMMM, yyyy")}
                    </p>
                </div>
            </div>
        </Link>
    );
}

function getAuthorAvatars(authors: string[]) {
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
