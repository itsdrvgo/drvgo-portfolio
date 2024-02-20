import DefaultAvatar from "@/public/authors/default.png";
import GroupAvatar from "@/public/authors/group.png";
import CopyButton from "@/src/components/global/buttons/copy-button";
import BlogShell from "@/src/components/global/shells/blog-shell";
import MdxGallery from "@/src/components/mdx/gallery";
import MdxImage from "@/src/components/mdx/image";
import MdxLink from "@/src/components/mdx/link";
import YouTube from "@/src/components/mdx/youtube";
import { IMAGE_EXTENSIONS } from "@/src/config/const";
import { siteConfig } from "@/src/config/site";
import { cn, getReadTime } from "@/src/lib/utils";
import { Blog, blogMetadataSchema } from "@/src/lib/validation/blog";
import "@/src/styles/github-dark.css";
import fs from "fs";
import path from "path";
import BlogCard from "@/src/components/blogs/blog-card";
import { Avatar, Divider, Link } from "@nextui-org/react";
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
import React from "react";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

const BLOGS_DIR = "blogs";

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
        creator: siteConfig.name,
        openGraph: {
            title: blog.frontMatter.title + " | Blogs | " + siteConfig.name,
            description: blog.frontMatter.description,
            type: "article",
            locale: "en_US",
            url: siteConfig.url + "/blogs/" + blog.slug,
            authors: blog.frontMatter.authors.map((author) => author.name),
            publishedTime: new Date(blog.frontMatter.date).toISOString(),
            tags: blog.frontMatter.tags,
            siteName: siteConfig.name,
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
            title: blog.frontMatter.title + " | Blogs | " + siteConfig.name,
            description: blog.frontMatter.description,
            card: "summary_large_image",
            creator: "@itsdrvgo",
            creatorId: "itsdrvgo",
            images: [getBlogThumbnail(blog.slug) || siteConfig.ogImage],
        },
    };
}

function Page(props: PageProps) {
    const blog = getBlogInfo(props);
    if (!blog) notFound();

    const blogAuthors = blog.frontMatter.authors;
    const readTime = getReadTime(blog.content);

    const relatedBlogs = getRelatedBlogs(props);

    return (
        <BlogShell>
            <div className="flex flex-col items-center justify-center md:flex-row md:items-stretch">
                <article
                    className={cn(
                        "prose prose-sm prose-sky !prose-invert w-full p-5 md:prose-base lg:prose-lg",
                        relatedBlogs.length > 0 ? "max-w-[80ch]" : "max-w-full"
                    )}
                >
                    <h1>{blog.frontMatter.title}</h1>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-4">
                            <div>
                                <Avatar
                                    src={getAuthorAvatar(
                                        blogAuthors.map((author) =>
                                            author.name
                                                .toLowerCase()
                                                .replace(" ", "-")
                                        )
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
                                                {index ===
                                                blogAuthors.length - 1
                                                    ? ""
                                                    : ", "}
                                            </span>
                                        ) : (
                                            <span key={author.name}>
                                                {author.name}
                                                {index ===
                                                blogAuthors.length - 1
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

                        <p className="text-sm text-white/60">
                            {readTime} min read
                        </p>
                    </div>

                    <div className="my-10 rounded-lg border border-white/15 bg-default-50 p-6 md:px-10">
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
                            Image: MdxImage,
                            Gallery: MdxGallery,
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
                            pre: (props) => {
                                const code = React.Children.toArray(
                                    props.children
                                ).map((child) => {
                                    if (React.isValidElement(child)) {
                                        return child.props.children;
                                    }
                                    return child;
                                });

                                const stringfiedCode = React.Children.toArray(
                                    code
                                )
                                    .map((child) => {
                                        if (React.isValidElement(child)) {
                                            return child.props.children;
                                        }
                                        return child;
                                    })
                                    .join("");

                                return (
                                    <div className="group relative">
                                        <pre {...props} />
                                        <CopyButton
                                            content={stringfiedCode}
                                            className="opacity-0 transition-all ease-in-out group-hover:opacity-100"
                                        />
                                    </div>
                                );
                            },
                            code: ({ className, ...props }) => {
                                return (
                                    <code
                                        className={cn(
                                            "whitespace-pre-wrap",
                                            className
                                        )}
                                        {...props}
                                    />
                                );
                            },
                            blockquote: ({ className, children, ...props }) => {
                                const removeMargins = (
                                    child: React.ReactNode
                                ) => {
                                    if (React.isValidElement(child)) {
                                        return React.cloneElement(
                                            child as React.ReactElement<any>,
                                            {
                                                className:
                                                    "lg:my-2 lg:text-base",
                                            }
                                        );
                                    }
                                    return child;
                                };

                                return (
                                    <blockquote
                                        className={cn(
                                            "rounded-r-md bg-default-50 py-2 pr-4",
                                            className
                                        )}
                                        {...props}
                                    >
                                        {React.Children.map(
                                            children,
                                            removeMargins
                                        )}
                                    </blockquote>
                                );
                            },
                        }}
                    />
                </article>

                {relatedBlogs.length > 0 && (
                    <div className="basis-1/5 px-4 md:border-l md:border-white/10">
                        <div className="space-y-4">
                            <h4 className="text-2xl font-semibold">
                                Related Blogs
                            </h4>

                            <Divider />

                            <div className="space-y-2">
                                {relatedBlogs.map((blog) => (
                                    <BlogCard
                                        key={blog.slug}
                                        blog={blog}
                                        href={"/blogs/" + blog.slug}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
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
    const thumbnailExt = IMAGE_EXTENSIONS.find((extension) =>
        fs.existsSync(path.join("public", "thumbnails", slug + "." + extension))
    );
    if (!thumbnailExt) return null;

    const imagePath = "/thumbnails/" + slug + "." + thumbnailExt;
    return imagePath;
}

function getAuthorAvatar(authors: string[]) {
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

function getRelatedBlogs(props: PageProps) {
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
