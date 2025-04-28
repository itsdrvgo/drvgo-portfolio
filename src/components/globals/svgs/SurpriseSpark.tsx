import { SVGProps } from "react";

export function SurpriseSparkleLeft({
    width,
    height,
    className,
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            id="SurpriseSparkleLeft"
            data-name="SurpriseSparkleLeft"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 1000"
            height={height || 30}
            width={width || 30}
            className={className}
            {...props}
        >
            <rect
                fill="#abcff9"
                x="754.78"
                y="-19.33"
                width="76.31"
                height="364"
                rx="38.15"
                transform="translate(49.08 481.87) rotate(-34.82)"
            />
            <rect
                fill="#abcff9"
                x="400.64"
                y="84.88"
                width="76.31"
                height="646.14"
                rx="38.15"
                transform="translate(-116.28 633.46) rotate(-65.02)"
            />
            <rect
                fill="#abcff9"
                x="459.18"
                y="673.22"
                width="76.31"
                height="404.68"
                rx="38.15"
                transform="translate(-298.6 1492.37) rotate(-98.18)"
            />
        </svg>
    );
}

export function SurpriseSparkleRight({
    width,
    height,
    className,
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            id="SurpriseSparkleRight"
            data-name="SurpriseSparkleRight"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 1000"
            height={height || 30}
            width={width || 30}
            className={className}
            {...props}
        >
            <rect
                fill="#abcff9"
                x="224.5"
                y="-19.33"
                width="76.31"
                height="364"
                rx="38.15"
                transform="translate(385.4 446.18) rotate(-145.18)"
            />
            <rect
                fill="#abcff9"
                x="578.63"
                y="84.88"
                width="76.31"
                height="646.14"
                rx="38.15"
                transform="translate(507.41 1139.3) rotate(-114.98)"
            />
            <rect
                fill="#abcff9"
                x="520.09"
                y="673.22"
                width="76.31"
                height="404.68"
                rx="38.15"
                transform="translate(-387.81 1303.61) rotate(-81.82)"
            />
        </svg>
    );
}
