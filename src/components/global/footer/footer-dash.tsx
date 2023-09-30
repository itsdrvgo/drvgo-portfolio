"use client";

import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import DRVGOLogo from "../DRVGOLogo";

function FooterDash({
    className,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
    return (
        <footer
            className={cn(
                "relative flex w-full flex-col items-center justify-center border-t border-border bg-background p-5",
                className
            )}
            {...props}
        >
            <div className="flex w-full max-w-[75rem] flex-col items-center justify-between gap-7 md:flex-row">
                <DRVGOLogo height={40} width={40} />
                <p className="text-sm">
                    <span>Copyright © 2023 </span>

                    <Link
                        as={NextLink}
                        href={siteConfig.url}
                        underline="always"
                        className="text-sm font-semibold text-accent"
                    >
                        DRVGO
                    </Link>

                    <span>, All rights reserved.</span>
                </p>
            </div>
        </footer>
    );
}

export default FooterDash;
