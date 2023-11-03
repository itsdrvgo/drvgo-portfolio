import { SVGProps } from "react";

export function Sparkle({
    width,
    height,
    className,
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            id="Sparkle"
            data-name="Sparkle"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 67.22 67.22"
            height={height || 30}
            width={width || 30}
            className={className}
            {...props}
        >
            <g id="Layer_2" data-name="Layer 2">
                <g id="OBJECTS">
                    <path
                        fill="#fff"
                        d="M33.61,0l1.67,14.81A19.41,19.41,0,0,0,52.4,31.94l14.82,1.67L52.4,35.28A19.41,19.41,0,0,0,35.28,52.4L33.61,67.22,31.94,52.4A19.41,19.41,0,0,0,14.81,35.28L0,33.61l14.81-1.67A19.41,19.41,0,0,0,31.94,14.81Z"
                    />
                </g>
            </g>
        </svg>
    );
}
