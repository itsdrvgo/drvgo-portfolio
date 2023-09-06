"use client";

import { cn } from "@/src/lib/utils";
import { ButtonHTMLAttributes, useEffect, useState } from "react";
import { Icons } from "../icons/icons";

interface PageProps extends ButtonHTMLAttributes<HTMLElement> {
    item: string;
}

function CopyButton({ className, item }: PageProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 5000);
        }
    }, [copied]);

    return (
        <button
            className={cn(
                "absolute right-2 top-2 rounded-md border border-gray-400 p-2 text-gray-400",
                className
            )}
            onClick={() => {
                navigator.clipboard.writeText(item);
                setCopied(true);
            }}
        >
            {copied ? (
                <Icons.check className="h-4 w-4" />
            ) : (
                <Icons.copy className="h-4 w-4" />
            )}
        </button>
    );
}

export default CopyButton;
