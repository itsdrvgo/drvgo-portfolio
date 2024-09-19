import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";

export function MdxLink(
    props: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
) {
    const href = props.href;
    const isInternalLink = href && href.startsWith("/");

    if (isInternalLink) {
        return (
            <Link className="text-primary no-underline lg:my-0" {...props}>
                {props.children}
            </Link>
        );
    }

    return (
        <Link
            className="text-primary no-underline lg:my-0"
            target="_blank"
            {...props}
        />
    );
}
