import { inter } from "@/app/fonts";
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
import { ChevronLeft } from "lucide-react";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import Image from "next/image";
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
            className={cn(inter.className, "min-h-screen", className)}
            {...props}
        >
            {/* Hero banner */}
            <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
                <Image
                    src={blog.meta.thumbnail}
                    alt={blog.meta.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/10" />

                {/* Back link */}
                <div className="absolute top-6 left-6 z-10">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-black/50"
                    >
                        <ChevronLeft className="size-3.5" />
                        Back
                    </Link>
                </div>
            </div>

            {/* Article container — overlaps the banner slightly */}
            <div className="relative mx-auto -mt-20 max-w-3xl px-5 pb-16 2xl:max-w-4xl">
                <article className="prose max-w-full prose-neutral dark:prose-invert prose-headings:font-[family-name:var(--font-space-grotesk)] prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                    {/* Title + meta */}
                    <div className="mb-8 rounded-2xl border bg-card/80 p-6 shadow-sm backdrop-blur-md md:p-8">
                        <div className="mb-4 flex flex-wrap gap-2">
                            {blog.meta.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-gradient my-0! mb-5! text-2xl font-bold tracking-tight md:text-4xl">
                            {blog.meta.title}
                        </h1>

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
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
                                    <p className="my-0! text-sm font-medium">
                                        {blog.meta.authors.map((author, i) =>
                                            author.url ? (
                                                <span key={author.name}>
                                                    <Link
                                                        href={author.url}
                                                        target="_blank"
                                                        className="text-foreground no-underline transition-colors hover:text-primary"
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

                                    <p className="my-0! text-xs text-muted-foreground">
                                        {format(
                                            new Date(blog.meta.date),
                                            "do MMMM, yyyy"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                {readTime} min read
                            </span>
                        </div>
                    </div>

                    {/* Table of Contents */}
                    <div className="my-8! overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
                        <div className="border-b bg-muted/40 px-6 py-3 md:px-8">
                            <h2 className="my-0! text-sm font-semibold tracking-wide text-muted-foreground uppercase lg:my-0!">
                                Table of Contents
                            </h2>
                        </div>
                        <div className="p-6 md:px-8">
                            <TableOfContents content={blog.content} />
                        </div>
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
                                    <div className="my-6 overflow-hidden rounded-xl border">
                                        <div className="flex items-center justify-between gap-4 border-b border-border/60 bg-foreground/[0.06] px-4 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1.5">
                                                    <span className="size-2.5 rounded-full bg-red-400/60" />
                                                    <span className="size-2.5 rounded-full bg-yellow-400/60" />
                                                    <span className="size-2.5 rounded-full bg-green-400/60" />
                                                </div>
                                                <p className="my-0! text-xs font-medium text-muted-foreground">
                                                    {parsedSnippetData.data.name
                                                        ? parsedSnippetData.data
                                                              .name
                                                        : "Code Block"}
                                                </p>
                                            </div>
                                            <CopyButton content={content} />
                                        </div>
                                        <pre
                                            className="mt-0! rounded-t-none! border-0!"
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
                                            "rounded-r-xl border-l-primary/60 bg-primary/5 py-2 pr-4",
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

                {/* Bottom navigation */}
                <div className="mt-12 border-t pt-8">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        <ChevronLeft className="size-4" />
                        All blogs
                    </Link>
                </div>
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
        <ul className="mb-0! list-none pl-0! lg:mb-0!">
            {headingsWithId.map((heading) => (
                <li
                    key={heading.text}
                    className="my-0! border-l-2 border-border/60 py-1 pl-4 transition-colors hover:border-primary lg:my-0!"
                >
                    <Link
                        href={"#" + heading.id}
                        className="text-sm text-muted-foreground no-underline transition-colors ease-in-out hover:text-primary"
                    >
                        {heading.text}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
