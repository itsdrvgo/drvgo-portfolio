import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";

export function MdxLink(
    props: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
) {
    const href = props.href;
    const isInternalLink = href && href.startsWith("/");

    return (
        <Link
            className="text-primary no-underline lg:my-0!"
            target={isInternalLink ? "_self" : "_blank"}
            rel={isInternalLink ? undefined : "noopener noreferrer"}
            {...props}
        />
    );
}
