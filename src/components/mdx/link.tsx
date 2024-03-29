import { Link, LinkProps } from "@nextui-org/react";
import NextLink from "next/link";

function MdxLink(props: LinkProps) {
    const href = props.href;
    const isInternalLink = href && href.startsWith("/");

    if (isInternalLink) {
        return (
            <Link
                as={NextLink}
                className="text-sm text-primary-600 md:text-base lg:my-0 lg:text-lg"
                underline="hover"
                {...props}
            >
                {props.children}
            </Link>
        );
    }

    return (
        <Link
            isExternal
            className="text-sm text-primary-600 md:text-base lg:my-0 lg:text-lg"
            underline="hover"
            {...props}
        />
    );
}

export default MdxLink;
