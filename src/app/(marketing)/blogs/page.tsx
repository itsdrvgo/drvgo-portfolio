import DefaultAvatar from "@/public/blogs/authors/default.png";
import GeneralShell from "@/src/components/global/shells/general-shell";
import { cn, getReadTime } from "@/src/lib/utils";
import { BlogMetadata, blogMetadataSchema } from "@/src/lib/validation/blog";
import { Avatar, Divider, Tooltip } from "@nextui-org/react";
import "date-fns";
import fs from "fs";
import path from "path";
import { IMAGE_EXTENSIONS } from "@/src/config/const";
import { format } from "date-fns";
import matter from "gray-matter";
import Link from "next/link";

interface Blog {
    meta: BlogMetadata;
    slug: string;
    content: string;
}

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

            <div className="py-2">
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

    return (
        <Link href={"/blogs/" + blog.slug}>
            <div className="flex items-center justify-between gap-5 py-2">
                <div className="basis-7/12">
                    <h3 className="text-lg font-bold">{blog.meta.title}</h3>
                    <p className="text-sm text-white/60 md:text-base">
                        {blog.meta.description}
                    </p>
                </div>

                <div className="hidden items-center gap-1 md:flex">
                    {authorAvatars.map((avatar, index) => (
                        <Tooltip key={index} content={blogAuthors[index].name}>
                            <Avatar
                                src={avatar}
                                alt={blog.meta.title}
                                classNames={{
                                    base: cn(index !== 0 && "relative -left-2"),
                                }}
                                color="primary"
                                isBordered
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

                <div className="text-end text-sm text-white/60">
                    <p>{format(new Date(blog.meta.date), "do MMMM, yyyy")}</p>
                    <p>{getReadTime(blog.content)} min read</p>
                </div>
            </div>

            <Divider />
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
