import { SVGProps } from "react";

export function Code({
    width,
    height,
    className,
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            id="Code"
            data-name="Code"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1972 1972"
            height={height || 30}
            width={width || 30}
            className={className}
            {...props}
        >
            <path
                fill="#fff"
                d="m553 1399-50 50q-10 10-23 10t-23-10L-9 983q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23t-10 23L160 960l393 393q10 10 10 23t-10 23zm591-1067L771 1623q-4 13-15.5 19.5T732 1645l-62-17q-13-4-19.5-15.5T648 1588l373-1291q4-13 15.5-19.5t23.5-2.5l62 17q13 4 19.5 15.5t2.5 24.5zm657 651-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23t-10 23z"
            ></path>
        </svg>
    );
}
