"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
    content: string;
}

export function CopyButton({ content }: Props) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) setTimeout(() => setCopied(false), 2000);
    }, [copied]);

    return (
        <Button
            variant="outline"
            className={cn(
                "h-auto min-w-16 rounded-sm border-1 border-foreground bg-background px-2 py-1 text-xs text-muted-foreground uppercase md:min-w-20 md:px-3 md:text-sm"
            )}
            onClick={() => {
                navigator.clipboard.writeText(content);
                setCopied(true);
            }}
        >
            {copied ? "Copied" : "Copy"}
        </Button>
    );
}
