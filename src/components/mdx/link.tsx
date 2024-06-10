import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";

export function MdxLink(
    props: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
) {
    const href = props.href;
    const isInternalLink = href && href.startsWith("/");

    if (isInternalLink) {
        return (
            <Link
                className="text-sm text-primary no-underline md:text-base lg:my-0 lg:text-lg"
                {...props}
            >
                {props.children}
            </Link>
        );
    }

    return (
        <Link
            className="text-sm text-primary no-underline md:text-base lg:my-0 lg:text-lg"
            target="_blank"
            {...props}
        />
    );
}
