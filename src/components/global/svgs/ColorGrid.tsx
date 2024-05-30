import { SVGProps } from "react";

export function ColorGrid({
    width,
    height,
    className,
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            id="ColorGrid"
            data-name="ColorGrid"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 549 512"
            width={width || 549}
            height={height || 512}
            className={className}
            fill="none"
            {...props}
        >
            <line
                x1="194.5"
                y1="2.18557e-08"
                x2="194.5"
                y2="469"
                stroke="black"
            />
            <line
                x1="4.5413e-08"
                y1="340.5"
                x2="537"
                y2="340.5"
                stroke="black"
            />
            <line x1="371.5" y1="108" x2="371.5" y2="512" stroke="black" />
            <line x1="50" y1="167.5" x2="549" y2="167.5" stroke="black" />
            <rect x="195" y="168" width="176" height="172" fill="#6B2CC3" />
            <rect x="373" y="108" width="176" height="59" fill="#ABCFF8" />
            <rect y="341" width="194" height="128" fill="#75DC30" />
        </svg>
    );
}
