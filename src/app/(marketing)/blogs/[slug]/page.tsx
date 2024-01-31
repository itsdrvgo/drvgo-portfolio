import DefaultAvatar from "@/public/authors/default.png";
import GroupAvatar from "@/public/authors/group.png";
import BlogShell from "@/src/components/global/shells/blog-shell";
import MdxLink from "@/src/components/mdx/link";
import YouTube from "@/src/components/mdx/youtube";
import { getReadTime } from "@/src/lib/utils";
import { blogMetadataSchema } from "@/src/lib/validation/blog";
import "@/src/styles/github-dark.css";
import fs from "fs";
import path from "path";
import { siteConfig } from "@/src/config/site";
import { Avatar, Link } from "@nextui-org/react";
import { format } from "date-fns";
import matter from "gray-matter";
import langBash from "highlight.js/lib/languages/bash";
import langC from "highlight.js/lib/languages/c";
import langCss from "highlight.js/lib/languages/css";
import langJs from "highlight.js/lib/languages/javascript";
import langJson from "highlight.js/lib/languages/json";
import langPy from "highlight.js/lib/languages/python";
import langRust from "highlight.js/lib/languages/rust";
import langTs from "highlight.js/lib/languages/typescript";
import langHtml from "highlight.js/lib/languages/xml";
import { Metadata } from "next";
import { SerializeOptions } from "next-mdx-remote/dist/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

const options: SerializeOptions = {
    mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            [
                // @ts-expect-error
                rehypeHighlight,
                {
                    languages: {
                        js: langJs,
                        ts: langTs,
                        bash: langBash,
                        py: langPy,
                        rust: langRust,
                        c: langC,
                        json: langJson,
                        html: langHtml,
                        css: langCss,
                    },
                },
            ],
        ],
    },
};

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const blog = getBlogInfo(props);
    if (!blog)
        return {
            title: "Invalid Blog | Blogs",
            description: "Blog not found",
        };

    return {
        title: blog.frontMatter.title + " | Blogs",
        description: blog.frontMatter.description,
        keywords: blog.frontMatter.tags,
        authors: blog.frontMatter.authors,
        openGraph: {
            title: blog.frontMatter.title,
            description: blog.frontMatter.description,
            images: [
                {
                    url: getBlogThumbnail(blog.slug) || siteConfig.ogImage,
                    width: 1920,
                    height: 1080,
                    alt: blog.frontMatter.title,
                },
            ],
        },
        twitter: {
            title: blog.frontMatter.title,
            description: blog.frontMatter.description,
            images: [getBlogThumbnail(blog.slug) || siteConfig.ogImage],
        },
    };
}

function Page(props: PageProps) {
    const blog = getBlogInfo(props);
    if (!blog) notFound();

    const blogAuthors = blog.frontMatter.authors;
    const readTime = getReadTime(blog.content);

    return (
        <BlogShell>
            <article className="prose prose-sm prose-slate !prose-invert max-w-full md:prose-base lg:prose-lg">
                <h1>{blog.frontMatter.title}</h1>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                        <div>
                            <Avatar
                                src={getAuthorAvatar(
                                    blogAuthors.map((author) => author.name)
                                )}
                                alt={blogAuthors
                                    .map((author) => author.name)
                                    .join(", ")}
                                showFallback
                                color="primary"
                                isBordered
                            />
                        </div>

                        <div className="space-y-0">
                            <p className="!my-0 text-base text-white">
                                {blogAuthors.map((author, index) =>
                                    author.url ? (
                                        <span key={author.name}>
                                            <Link
                                                href={author.url}
                                                isExternal
                                                underline="none"
                                                color="foreground"
                                            >
                                                {author.name}
                                            </Link>
                                            {index === blogAuthors.length - 1
                                                ? ""
                                                : ", "}
                                        </span>
                                    ) : (
                                        <span key={author.name}>
                                            {author.name}
                                            {index === blogAuthors.length - 1
                                                ? ""
                                                : ", "}
                                        </span>
                                    )
                                )}
                            </p>

                            <p className="m-0 text-sm text-white/60">
                                {format(
                                    new Date(blog.frontMatter.date),
                                    "do MMMM, yyyy"
                                )}
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-white/60">{readTime} min read</p>
                </div>

                <div className="my-10 rounded-lg border bg-default-50 p-6 md:px-10">
                    <h2 className="my-0 mb-5 lg:my-0 lg:mb-5">
                        Table of Contents
                    </h2>
                    <TableOfContents content={blog.content} />
                </div>

                <MDXRemote
                    source={blog.content}
                    options={options}
                    components={{
                        YouTube,
                        Link: MdxLink,
                        h2: ({ children, ...props }) => (
                            <h2
                                id={children
                                    ?.toString()
                                    .toLowerCase()
                                    .replace(/\s/g, "-")
                                    .replace(/:$/, "")}
                                {...props}
                            >
                                {children}
                            </h2>
                        ),
                        h3: ({ children, ...props }) => (
                            <h3
                                id={children
                                    ?.toString()
                                    .toLowerCase()
                                    .replace(/\s/g, "-")
                                    .replace(/:$/, "")}
                                {...props}
                            >
                                {children}
                            </h3>
                        ),
                        h4: ({ children, ...props }) => (
                            <h4
                                id={children
                                    ?.toString()
                                    .toLowerCase()
                                    .replace(/\s/g, "-")
                                    .replace(/:$/, "")}
                                {...props}
                            >
                                {children}
                            </h4>
                        ),
                        h5: ({ children, ...props }) => (
                            <h5
                                id={children
                                    ?.toString()
                                    .toLowerCase()
                                    .replace(/\s/g, "-")
                                    .replace(/:$/, "")}
                                {...props}
                            >
                                {children}
                            </h5>
                        ),
                        h6: ({ children, ...props }) => (
                            <h6
                                id={children
                                    ?.toString()
                                    .toLowerCase()
                                    .replace(/\s/g, "-")
                                    .replace(/:$/, "")}
                                {...props}
                            >
                                {children}
                            </h6>
                        ),
                    }}
                />
            </article>
        </BlogShell>
    );
}

export default Page;

export async function generateStaticParams() {
    const files = fs.readdirSync(path.join("blogs"));

    const paths = files.map((filename) => ({
        slug: filename.replace(".mdx", ""),
    }));

    return paths;
}

function getBlogThumbnail(slug: string) {
    const imageExtensions = ["png", "jpg", "jpeg", "webp", "svg"];

    const thumbnail = imageExtensions.find((extension) =>
        fs.existsSync(path.join("public", "blogs", slug + "." + extension))
    );
    if (!thumbnail) return null;

    const imagePath = "/blogs/" + slug + "." + thumbnail;
    return imagePath;
}

function TableOfContents({ content }: { content: string }) {
    const headings = content.match(/#{1,6} .+/g);
    if (!headings) return null;

    const headingsWithId = headings.map((heading) => {
        const headingText = heading.replace(/#{1,6} /, "");
        const headingId = headingText
            .toLowerCase()
            .replace(/\s/g, "-")
            .replace(/:$/, "");

        return {
            text: headingText,
            id: headingId,
        };
    });

    return (
        <ul className="mb-0 lg:mb-0">
            {headingsWithId.map((heading) => (
                <li key={heading.text} className="lg:my-0">
                    <Link href={"#" + heading.id} color="foreground">
                        {heading.text}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

function getBlogInfo({ params }: PageProps) {
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

function getAuthorAvatar(authors: string[]) {
    const imageExtensions = ["png", "jpg", "jpeg", "webp", "svg"];

    if (authors.length > 1) return GroupAvatar.src;

    const authorAvatar = imageExtensions.find((extension) =>
        fs.existsSync(
            path.join("public", "authors", authors[0] + "." + extension)
        )
    );
    if (!authorAvatar) return DefaultAvatar.src;

    const fileBuffer = fs.readFileSync(
        path.join("public", "authors", authors[0] + "." + authorAvatar)
    );

    const image = Buffer.from(fileBuffer).toString("base64");
    return "data:image/" + authorAvatar + ";base64," + image;
}
