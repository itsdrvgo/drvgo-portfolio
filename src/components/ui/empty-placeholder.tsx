"use client";

import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { ReactNode } from "react";
import { Icons } from "../icons";
import { Card, CardContent, CardFooter, CardHeader } from "./card";

export interface EmptyPlaceholderProps {
    title: string;
    description: string;
    icon?: keyof typeof Icons;
    endContent?: ReactNode;
    isBackgroundVisible?: boolean;
    className: ClassValue;
}

export function EmptyPlaceholder({
    title,
    description,
    icon,
    endContent,
    isBackgroundVisible = true,
    className,
    ...props
}: EmptyPlaceholderProps) {
    const Icon = icon ? Icons[icon] : undefined;

    return (
        <Card
            className={cn(
                "gap-3 rounded-xl py-10",
                isBackgroundVisible
                    ? "bg-card shadow-md"
                    : "bg-transparent shadow-none",
                className
            )}
            {...props}
        >
            {Icon && (
                <CardHeader className="items-center justify-center">
                    <div className="rounded-full bg-primary p-5 text-primary-foreground">
                        <Icon />
                    </div>
                </CardHeader>
            )}

            <CardContent className="flex flex-col items-center gap-4 text-center">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="max-w-xs text-balance text-sm text-muted-foreground">
                    {description}
                </p>
            </CardContent>

            {endContent && (
                <CardFooter className="flex items-center justify-center">
                    {endContent}
                </CardFooter>
            )}
        </Card>
    );
}
