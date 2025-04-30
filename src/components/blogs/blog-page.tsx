import { roboto } from "@/app/fonts";
import {
    MdxGallery,
    MdxHighlight,
    MdxImage,
    MdxLink,
    MdxSnippet,
    YouTube,
} from "@/components/mdx";
import { cn } from "@/lib/utils";
import { Blog, snippetMetaSchema } from "@/lib/validations";
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
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import Link from "next/link";
import React from "react";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { CopyButton } from "../globals/buttons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAvatar, getReadTime } from "./utils";
import "@/styles/github-dark.css";

interface PageProps extends GenericProps {
    blog: Blog;
}

const options: MDXRemoteProps["options"] = {
    mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            [
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

export function BlogPage({ className, blog, ...props }: PageProps) {
    const readTime = getReadTime(blog.content);

    return (
        <section
            className={cn(
                roboto.className,
                "flex min-h-screen justify-center p-5 py-10",
                className
            )}
            {...props}
        >
            <div className="w-full max-w-4xl space-y-8 2xl:max-w-6xl">
                <article className="prose max-w-full prose-sky">
                    <h1>{blog.meta.title}</h1>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-4">
                            <Avatar className="outline-1 outline-primary">
                                <AvatarImage
                                    src={getAvatar(blog.meta.authors)}
                                    alt={blog.meta.authors
                                        .map((a) => a.name)
                                        .join(", ")}
                                    className="my-0!"
                                />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>

                            <div className="space-y-0">
                                <p className="my-0! text-base">
                                    {blog.meta.authors.map((author, i) =>
                                        author.url ? (
                                            <span key={author.name}>
                                                <Link
                                                    href={author.url}
                                                    target="_blank"
                                                    className="no-underline"
                                                >
                                                    {author.name}
                                                </Link>
                                                {i ===
                                                blog.meta.authors.length - 1
                                                    ? ""
                                                    : ", "}
                                            </span>
                                        ) : (
                                            <span key={author.name}>
                                                {author.name}
                                                {i ===
                                                blog.meta.authors.length - 1
                                                    ? ""
                                                    : ", "}
                                            </span>
                                        )
                                    )}
                                </p>

                                <p className="my-0! text-sm text-muted-foreground">
                                    {format(
                                        new Date(blog.meta.date),
                                        "do MMMM, yyyy"
                                    )}
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-white/60">
                            {readTime} min read
                        </p>
                    </div>

                    <div className="my-10! rounded-lg bg-card p-6 md:px-10">
                        <h2 className="my-0! mb-5 lg:my-0! lg:mb-5!">
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
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        return (child.props as any).children;
                                    return child;
                                });

                                const stringfiedCode = React.Children.toArray(
                                    code
                                )
                                    .map((child) => {
                                        if (React.isValidElement(child))
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            return (child.props as any)
                                                .children;
                                        return child;
                                    })
                                    .join("");

                                const { data: frontMatter, content } =
                                    matter(stringfiedCode);

                                const parsedSnippetData =
                                    snippetMetaSchema.safeParse(frontMatter);
                                if (!parsedSnippetData.success) return null;

                                return (
                                    <div>
                                        <div className="flex items-center justify-between gap-5 rounded-md rounded-b-none bg-foreground p-2">
                                            <p className="my-0! space-x-1 pl-1 text-background/60">
                                                <span className="text-accent">
                                                    &gt;
                                                </span>{" "}
                                                {parsedSnippetData.data.name
                                                    ? parsedSnippetData.data
                                                          .name
                                                    : "Code Block"}
                                            </p>
                                            <CopyButton content={content} />
                                        </div>
                                        <pre
                                            className="mt-0 rounded-t-none"
                                            {...props}
                                        />
                                    </div>
                                );
                            },
                            code: MdxSnippet,
                            blockquote: ({ className, children, ...props }) => {
                                const removeMargins = (
                                    child: React.ReactNode
                                ) => {
                                    if (React.isValidElement(child)) {
                                        return React.cloneElement(
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            </div>
        </section>
    );
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
        <ul className="mb-0! lg:mb-0!">
            {headingsWithId.map((heading) => (
                <li
                    key={heading.text}
                    className="marker:text-foreground lg:my-0!"
                >
                    <Link
                        href={"#" + heading.id}
                        className="text-muted-foreground no-underline transition-all ease-in-out hover:text-foreground"
                    >
                        {heading.text}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
