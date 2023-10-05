"use client";

import { cn } from "@/src/lib/utils";
import { Button, Tooltip } from "@nextui-org/react";
import { ButtonHTMLAttributes, useEffect, useState } from "react";
import { Icons } from "../../icons/icons";

interface PageProps extends ButtonHTMLAttributes<HTMLElement> {
    item: string;
}

function CopyButton({ className, item, ...props }: PageProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied]);

    return (
        <div className={cn("absolute right-2 top-2", className)} {...props}>
            <Tooltip
                content="Copied"
                placement="top"
                isOpen={copied}
                radius="sm"
                showArrow
            >
                <Button
                    radius="sm"
                    isIconOnly
                    variant="bordered"
                    className="text-gray-400"
                    onPress={() => {
                        navigator.clipboard.writeText(item);
                        setCopied(true);
                    }}
                >
                    <Icons.copy className="h-4 w-4" />
                </Button>
            </Tooltip>
        </div>
    );
}

export default CopyButton;
