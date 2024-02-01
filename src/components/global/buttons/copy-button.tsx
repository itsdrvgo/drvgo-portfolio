"use client";

import { cn } from "@/src/lib/utils";
import { Button } from "@nextui-org/react";
import { ButtonHTMLAttributes, useEffect, useState } from "react";

interface PageProps extends ButtonHTMLAttributes<HTMLElement> {
    content: string;
}

function CopyButton({ className, content, ...props }: PageProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied]);

    return (
        <div
            className={cn("absolute right-4 top-0 -translate-y-1/2", className)}
            {...props}
        >
            <Button
                radius="sm"
                variant="bordered"
                className="h-auto rounded-md border-1 bg-background px-3 py-1 uppercase text-white/80"
                onPress={() => {
                    navigator.clipboard.writeText(content);
                    setCopied(true);
                }}
            >
                {copied ? "Copied" : "Copy"}
            </Button>
        </div>
    );
}

export default CopyButton;
