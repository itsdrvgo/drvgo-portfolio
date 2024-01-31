import { Link, LinkProps } from "@nextui-org/react";
import NextLink from "next/link";

function MdxLink(props: LinkProps) {
    const href = props.href;
    const isInternalLink = href && href.startsWith("/");

    if (isInternalLink) {
        return (
            <Link
                as={NextLink}
                className="text-sm md:text-base lg:text-lg"
                {...props}
            >
                {props.children}
            </Link>
        );
    }

    return (
        <Link
            isExternal
            className="text-sm md:text-base lg:text-lg"
            {...props}
        />
    );
}

export default MdxLink;
