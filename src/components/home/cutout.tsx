import { cn } from "@/lib/utils";

interface CutoutProps extends GenericProps {
    isReversed?: boolean;
}

export function Cutout({ className, isReversed, ...props }: CutoutProps) {
    return (
        <div
            className={cn(
                "h-px w-full",
                isReversed
                    ? "bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                    : "bg-gradient-to-r from-transparent via-secondary/30 to-transparent",
                className
            )}
            {...props}
        />
    );
}
