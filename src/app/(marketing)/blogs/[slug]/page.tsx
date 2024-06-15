import { RelatedBlogCard, TableOfContents } from "@/components/blogs";
import {
    getAuthorAvatar,
    getBlogInfo,
    getBlogThumbnail,
    getReadTime,
    getRelatedBlogs,
} from "@/components/blogs/utils";
import { CopyButton } from "@/components/global/buttons";
import {
    MdxCode,
    MdxGallery,
    MdxHighlight,
    MdxImage,
    MdxLink,
    YouTube,
} from "@/components/mdx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ROBOTO_FONT } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { languageSettings } from "@/lib/highlightjs";
import { cn, getAbsoluteURL } from "@/lib/utils";
import "@/styles/github-dark.css";
import fs from "fs";
import path from "path";
import { snippetMetadataSchema } from "@/lib/validation/snippet";
import { format } from "date-fns";
import matter from "gray-matter";
import { Metadata } from "next";
import { SerializeOptions } from "next-mdx-remote/dist/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

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
            url: getAbsoluteURL(`/blogs/${blog.slug}`),
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

export async function generateStaticParams() {
    const files = fs.readdirSync(path.join("blogs"));

    const paths = files.map((filename) => ({
        slug: filename.replace(".mdx", ""),
    }));

    return paths;
}

const options: SerializeOptions = {
    mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            [
                rehypeHighlight,
                {
                    languages: languageSettings,
                },
            ],
        ],
    },
};

function Page(props: PageProps) {
    const blog = getBlogInfo(props);
    if (!blog) notFound();

    const blogAuthors = blog.frontMatter.authors;
    const readTime = getReadTime(blog.content);

    const relatedBlogs = getRelatedBlogs(props);

    return (
        <section
            className={cn(
                ROBOTO_FONT.className,
                "flex min-h-screen justify-center p-5 py-10"
            )}
        >
            <div className="w-full max-w-4xl space-y-8 2xl:max-w-6xl">
                <article className="prose prose-sky max-w-full">
                    <h1>{blog.frontMatter.title}</h1>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-4">
                            <Avatar className="outline outline-1 outline-primary">
                                <AvatarImage
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
                                    className="my-0"
                                />
                                <AvatarFallback>
                                    {blogAuthors
                                        .map((author) => author.name[0])
                                        .slice(0, 2)
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-0">
                                <p className="my-0 text-base">
                                    {blogAuthors.map((author, index) =>
                                        author.url ? (
                                            <span key={author.name}>
                                                <Link
                                                    href={author.url}
                                                    target="_blank"
                                                    className="no-underline"
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

                                <p className="my-0 text-sm text-muted-foreground">
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

                    <div className="my-10 rounded-lg bg-card p-6 md:px-10">
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
                            Highlight: MdxHighlight,
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
                                    if (React.isValidElement(child))
                                        return child.props.children;
                                    return child;
                                });

                                const stringfiedCode = React.Children.toArray(
                                    code
                                )
                                    .map((child) => {
                                        if (React.isValidElement(child))
                                            return child.props.children;
                                        return child;
                                    })
                                    .join("");

                                const { data: frontMatter, content } =
                                    matter(stringfiedCode);

                                const parsedSnippetData =
                                    snippetMetadataSchema.safeParse(
                                        frontMatter
                                    );
                                if (!parsedSnippetData.success) return null;

                                return (
                                    <div>
                                        <div className="flex items-center justify-between gap-5 rounded-md rounded-b-none bg-foreground p-2">
                                            <p className="my-0 space-x-1 pl-1 text-background/60">
                                                <span className="text-accent">
                                                    &gt;
                                                </span>{" "}
                                                {parsedSnippetData.data.name
                                                    ? parsedSnippetData.data
                                                          .name
                                                    : "Code Block"}
                                            </p>
                                            <CopyButton
                                                content={content}
                                                className="rounded-sm"
                                            />
                                        </div>
                                        <pre
                                            className="mt-0 rounded-t-none"
                                            {...props}
                                        />
                                    </div>
                                );
                            },
                            code: MdxCode,
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
                                            "bg-default-50 rounded-r-md py-2 pr-4",
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

                <Separator className="bg-foreground/60" />

                {relatedBlogs.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold md:text-2xl">
                            Related Blogs
                        </h4>

                        <div className="grid gap-5 md:grid-cols-3">
                            {relatedBlogs.map((blog) => (
                                <RelatedBlogCard
                                    key={blog.slug}
                                    blog={blog}
                                    href={"/blogs/" + blog.slug}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Page;
