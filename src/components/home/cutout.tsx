import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";

interface CutoutProps extends GenericProps {
    isReversed?: boolean;
}

export function Cutout({ className, isReversed, ...props }: CutoutProps) {
    return (
        <div
            className={cn("h-[5px] bg-background", className)}
            style={{
                backgroundImage: isReversed
                    ? "url(./waves_reversed.png)"
                    : "url(./waves_normal.png)",
                backgroundRepeat: "repeat-x",
                backgroundPosition: "center",
                backgroundSize: "contain",
            }}
            {...props}
        />
    );
}
