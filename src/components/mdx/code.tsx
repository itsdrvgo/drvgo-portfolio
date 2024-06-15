"use client";

import { cn } from "@/lib/utils";
import { snippetMetadataSchema } from "@/lib/validation/snippet";
import matter from "gray-matter";
import hljs from "highlight.js";
import {
    Children,
    DetailedHTMLProps,
    HTMLAttributes,
    isValidElement,
} from "react";

export function MdxCode({
    className,
    children,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
    const stringfiedCode = Children.toArray(children)
        .map((child) => {
            if (isValidElement(child)) return child.props.children;
            return child;
        })
        .join("");

    const { data: frontMatter, content } = matter(stringfiedCode);

    const parsedSnippetData = snippetMetadataSchema.safeParse(frontMatter);
    if (!parsedSnippetData.success) return null;

    const highlightedContent = hljs.highlight(content, {
        language: parsedSnippetData.data.language,
    }).value;

    return (
        <code
            className={cn("whitespace-pre-wrap", className)}
            dangerouslySetInnerHTML={{
                __html: highlightedContent,
            }}
            {...props}
        />
    );
}
