"use client";

import { cn } from "@/src/lib/utils";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardProps,
} from "@nextui-org/react";
import { ReactNode } from "react";
import { Icons } from "../icons/icons";

export interface EmptyPlaceholderProps extends CardProps {
    title: string;
    description: string;
    icon: keyof typeof Icons;
    endContent?: ReactNode;
}

export function EmptyPlaceholder({
    title,
    description,
    icon,
    className,
    endContent,
    ...props
}: EmptyPlaceholderProps) {
    const Icon = Icons[icon];

    return (
        <Card className={cn("gap-3 py-10", className)} fullWidth {...props}>
            <CardHeader className="items-center justify-center">
                <div className="rounded-full border bg-primary-200 p-5">
                    <div>
                        <Icon />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="flex flex-col items-center gap-4 text-center">
                <p className="text-2xl font-bold">{title}</p>
                <p className="max-w-xs text-sm text-gray-400">{description}</p>
            </CardBody>

            {endContent && (
                <CardFooter className="flex items-center justify-center">
                    {endContent}
                </CardFooter>
            )}
        </Card>
    );
}
