"use client";

import { cn } from "@/src/lib/utils";
import { DetailedHTMLProps, HTMLAttributes } from "react";

interface CardProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    fullWidth?: boolean;
    color?: "default" | "primary" | "secondary" | "success" | "danger";
    radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

type CardHeaderProps = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

type CardBodyProps = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

type CardFooterProps = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

function Card({
    children,
    fullWidth,
    color,
    radius,
    className,
    ...props
}: CardProps) {
    let colorClass: HTMLAttributes<HTMLDivElement>["className"],
        radiusClass: HTMLAttributes<HTMLDivElement>["className"];

    switch (color) {
        case "primary":
            colorClass = "bg-primary-100";
            break;
        case "secondary":
            colorClass = "bg-secondary-100";
            break;
        case "success":
            colorClass = "bg-success-100";
            break;
        case "danger":
            colorClass = "bg-danger-100";
            break;
        default:
            colorClass = "bg-default-50";
            break;
    }

    switch (radius) {
        case "none":
            radiusClass = "rounded-none";
            break;
        case "sm":
            radiusClass = "rounded-sm";
            break;
        case "md":
            radiusClass = "rounded-md";
            break;
        case "xl":
            radiusClass = "rounded-xl";
            break;
        case "2xl":
            radiusClass = "rounded-2xl";
            break;
        case "3xl":
            radiusClass = "rounded-3xl";
            break;
        case "full":
            radiusClass = "rounded-full";
            break;
        default:
            radiusClass = "rounded-lg";
            break;
    }

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-10 p-4",
                {
                    "w-full": fullWidth,
                },
                colorClass,
                radiusClass,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function CardHeader({ children, className, ...props }: CardHeaderProps) {
    return (
        <div
            className={cn("flex items-center justify-center", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function CardBody({ children, className, ...props }: CardBodyProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3 text-center",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function CardFooter({ children, className, ...props }: CardFooterProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-center text-center",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export { Card, CardHeader, CardBody, CardFooter };
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps };
