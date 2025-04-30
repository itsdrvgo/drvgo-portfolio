"use client";

import { cn } from "@/lib/utils";
import { snippetMetaSchema } from "@/lib/validations";
import matter from "gray-matter";
import hljs from "highlight.js";
import { Children, isValidElement } from "react";

export function MdxSnippet({ className, children, ...props }: GenericProps) {
    const stringfiedCode = Children.toArray(children)
        .map((child) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (isValidElement(child)) return (child.props as any).children;
            return child;
        })
        .join("");

    const { data: frontMatter, content } = matter(stringfiedCode);

    const parsedSnippetData = snippetMetaSchema.safeParse(frontMatter);
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
