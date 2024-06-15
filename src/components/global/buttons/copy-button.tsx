"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CopyButtonProps extends ButtonProps {
    content: string;
}

export function CopyButton({ className, content, ...props }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied]);

    return (
        <Button
            variant="outline"
            className={cn(
                "border-1 h-auto min-w-16 rounded-md border-foreground bg-background px-2 py-1 text-xs uppercase text-muted-foreground md:min-w-20 md:px-3 md:text-sm",
                className
            )}
            onClick={() => {
                navigator.clipboard.writeText(content);
                setCopied(true);
            }}
            {...props}
        >
            {copied ? "Copied" : "Copy"}
        </Button>
    );
}
