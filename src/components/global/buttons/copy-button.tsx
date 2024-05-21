"use client";

import { cn } from "@/src/lib/utils";
import { Button, ButtonProps } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface CopyButtonProps extends ButtonProps {
    content: string;
}

function CopyButton({ className, content, ...props }: CopyButtonProps) {
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
            radius="sm"
            variant="bordered"
            className={cn(
                "min-w-unit-16 md:min-w-unit-20 absolute right-4 top-0 h-auto -translate-y-1/2 rounded-md border-1 bg-background px-2 py-1 text-xs uppercase text-white/80 md:px-3 md:text-sm",
                className
            )}
            onPress={() => {
                navigator.clipboard.writeText(content);
                setCopied(true);
            }}
            {...props}
        >
            {copied ? "Copied" : "Copy"}
        </Button>
    );
}

export default CopyButton;
