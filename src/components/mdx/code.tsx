"use client";

import { cn } from "@/lib/utils";
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

    const { content } = matter(stringfiedCode);
    const highlightedContent = hljs.highlightAuto(content).value;

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
