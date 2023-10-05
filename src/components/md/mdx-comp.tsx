"use client";

import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { HTMLAttributes, ImgHTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import { SpecialComponents } from "react-markdown/lib/ast-to-react";
import { NormalComponents } from "react-markdown/lib/complex-types";
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import CopyButton from "../global/buttons/copy-button";
import LinkPreviewButton from "../global/buttons/link-preview-button";
import { Icons } from "../icons/icons";
import MdImage from "./mdx-image";

const chatComponents: Partial<
    Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
> = {
    h1: ({ className, ...props }) => (
        <h1
            className={cn("text-4xl font-bold tracking-tight", className)}
            {...props}
        />
    ),
    h2: ({ className, ...props }) => (
        <h2
            className={cn("text-3xl font-semibold tracking-tight", className)}
            {...props}
        />
    ),
    h3: ({ className, ...props }) => (
        <h3
            className={cn("text-2xl font-semibold tracking-tight", className)}
            {...props}
        />
    ),
    h4: ({ className, ...props }) => (
        <h4
            className={cn("text-xl font-semibold tracking-tight", className)}
            {...props}
        />
    ),
    h5: ({ className, ...props }) => (
        <h5
            className={cn("text-lg font-semibold tracking-tight", className)}
            {...props}
        />
    ),
    h6: ({ className, ...props }) => (
        <h6
            className={cn("text-base font-semibold tracking-tight", className)}
            {...props}
        />
    ),
    a: ({ children, ...props }) => (
        <LinkPreviewButton {...props}>{children}</LinkPreviewButton>
    ),
    p: ({ ...props }) => <p {...props} />,
    ul: ({ className, ...props }) => (
        <ul className={cn("list-inside list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
        <ol className={cn("list-inside list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
        <li className={cn("", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
        <blockquote
            className={cn(
                "mt-4 rounded border-l-2 border-accent bg-gray-900 px-6 py-2 italic [&>*]:text-gray-400",
                className
            )}
            {...props}
        />
    ),
    img: ({ alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
        // @ts-ignore
        <MdImage alt={alt} {...props} />
    ),
    hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
    table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
        <div className="my-6 w-full overflow-y-auto">
            <table className={cn("w-full", className)} {...props} />
        </div>
    ),
    tr: ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
        <tr
            className={cn("m-0 border-t p-0 even:bg-gray-400", className)}
            {...props}
        />
    ),
    th: ({ className, ...props }) => (
        <th
            className={cn(
                "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
                className
            )}
            {...props}
        />
    ),
    td: ({ className, ...props }) => (
        <td
            className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                className
            )}
            {...props}
        />
    ),
    pre: ({ className, ...props }) => (
        <pre
            className={cn(
                "my-4 overflow-x-auto rounded-lg border bg-code p-4",
                className
            )}
            {...props}
        />
    ),
    code: ({ className, inline, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || "");

        return !inline && match ? (
            <div className="relative">
                <SyntaxHighlighter
                    {...props}
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                        border: "none",
                        padding: "0.5rem",
                        margin: 0,
                    }}
                    showLineNumbers
                    lineNumberStyle={{
                        minWidth: "2rem",
                        paddingRight: "1rem",
                        textAlign: "right",
                    }}
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>

                <CopyButton item={String(children).replace(/\n$/, "")} />
            </div>
        ) : (
            <code
                {...props}
                className={cn(
                    "relative rounded bg-gray-800 px-[0.3rem] py-[0.2rem] font-mono text-sm",
                    className
                )}
            >
                {children}
            </code>
        );
    },
};

const articleComponents: Partial<
    Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
> = {
    h1: ({ className, ...props }) => (
        <h1
            className={cn("text-4xl font-bold tracking-tight", className)}
            {...props}
        />
    ),
    h2: ({ className, ...props }) => (
        <h2
            className={cn(
                "mt-8 border-b pb-1 text-3xl font-semibold tracking-tight",
                className
            )}
            id={props.children
                .toString()
                .toLowerCase()
                .replace(/\s/g, "-")
                .replace(/:$/, "")}
            {...props}
        >
            <Link
                href={
                    "#" +
                    props.children
                        .toString()
                        .toLowerCase()
                        .replace(/\s/g, "-")
                        .replace(/:$/, "")
                }
                className="flex items-center gap-3"
            >
                <div>
                    <Icons.link className="h-5 w-5 text-gray-400" />
                </div>
                {props.children}
            </Link>
        </h2>
    ),
    h3: ({ className, ...props }) => (
        <h3
            className={cn(
                "mt-8 text-2xl font-semibold tracking-tight",
                className
            )}
            id={props.children
                .toString()
                .toLowerCase()
                .replace(/\s/g, "-")
                .replace(/:$/, "")}
            {...props}
        >
            <Link
                href={
                    "#" +
                    props.children
                        .toString()
                        .toLowerCase()
                        .replace(/\s/g, "-")
                        .replace(/:$/, "")
                }
            >
                {props.children}
            </Link>
        </h3>
    ),
    h4: ({ className, ...props }) => (
        <h4
            className={cn(
                "mt-8 text-xl font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h5: ({ className, ...props }) => (
        <h5
            className={cn(
                "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h6: ({ className, ...props }) => (
        <h6
            className={cn(
                "mt-8 text-base font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    a: ({ className, ...props }) => (
        <a
            className={cn(
                "font-semibold underline underline-offset-4",
                className
            )}
            {...props}
        />
    ),
    p: ({ className, ...props }) => (
        <p
            className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}
            {...props}
        />
    ),
    ul: ({ className, ...props }) => (
        <ul className={cn("my-2 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
        <ol className={cn("my-2 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
        <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
        <blockquote
            className={cn(
                "mt-4 rounded border-l-2 border-accent bg-gray-900 px-6 py-2 italic [&>*]:text-gray-400",
                className
            )}
            {...props}
        />
    ),
    img: ({ alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
        // @ts-ignore
        <MdImage alt={alt} {...props} />
    ),
    hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
    table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
        <div className="my-6 w-full overflow-y-auto">
            <table className={cn("w-full", className)} {...props} />
        </div>
    ),
    tr: ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
        <tr
            className={cn("m-0 border-t p-0 even:bg-gray-400", className)}
            {...props}
        />
    ),
    th: ({ className, ...props }) => (
        <th
            className={cn(
                "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
                className
            )}
            {...props}
        />
    ),
    td: ({ className, ...props }) => (
        <td
            className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                className
            )}
            {...props}
        />
    ),
    pre: ({ className, ...props }) => (
        <pre
            className={cn(
                "my-4 overflow-x-auto rounded-lg border bg-code p-4",
                className
            )}
            {...props}
        />
    ),
    code: ({ className, inline, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || "");

        return !inline && match ? (
            <div className="relative">
                <SyntaxHighlighter
                    {...props}
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                        border: "none",
                        padding: "0.5rem",
                        margin: 0,
                    }}
                    showLineNumbers
                    lineNumberStyle={{
                        minWidth: "2rem",
                        paddingRight: "1rem",
                        textAlign: "right",
                    }}
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>

                <CopyButton item={String(children).replace(/\n$/, "")} />
            </div>
        ) : (
            <code
                {...props}
                className={cn(
                    "relative rounded bg-gray-800 px-[0.3rem] py-[0.2rem] font-mono text-sm",
                    className
                )}
            >
                {children}
            </code>
        );
    },
};

export function Mdx({ children }: ReactMarkdownOptions) {
    return (
        <ReactMarkdown
            components={articleComponents}
            remarkPlugins={[remarkGfm]}
        >
            {children}
        </ReactMarkdown>
    );
}

export function ChatMdx({ children }: ReactMarkdownOptions) {
    return (
        <ReactMarkdown components={chatComponents} remarkPlugins={[remarkGfm]}>
            {children}
        </ReactMarkdown>
    );
}
