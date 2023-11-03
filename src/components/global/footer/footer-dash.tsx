"use client";

import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import DRVGOLogo from "../svgs/DRVGOLogo";

function FooterDash({
    className,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
    return (
        <footer
            className={cn(
                "relative flex w-full flex-col items-center justify-center border-t border-border bg-default-50 p-5 py-3",
                className
            )}
            {...props}
        >
            <div className="flex w-full max-w-4xl flex-col items-center justify-between gap-7 md:flex-row 2xl:max-w-6xl">
                <DRVGOLogo height={40} width={40} />
                <p className="text-sm">
                    <span>Copyright © 2023 </span>

                    <Link
                        as={NextLink}
                        href={"/"}
                        underline="always"
                        className="text-sm font-semibold text-accent"
                    >
                        {siteConfig.name}
                    </Link>

                    <span>, All rights reserved.</span>
                </p>
            </div>
        </footer>
    );
}

export default FooterDash;
