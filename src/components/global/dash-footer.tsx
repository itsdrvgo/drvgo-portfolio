import DRVGOLogo from "@/public/DRVGO.svg";
import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "../icons/icons";

function DashFooter({ className }: DefaultProps) {
    return (
        <footer
            className={cn(
                "relative flex w-full flex-col items-center justify-center space-y-20 border-t border-border bg-background py-10",
                className
            )}
        >
            <div className="flex flex-col items-center justify-center gap-7">
                <Image src={DRVGOLogo} alt="DRVGO" width={100} height={100} />
                <p className="w-60 text-center">
                    Learning, Coding & Bringing the best out of me.
                </p>
                <div className="flex gap-5">
                    <Link
                        href={siteConfig.links.twitter}
                        className="rounded-full bg-secondary p-3"
                    >
                        <Icons.twitter className="h-4 w-4" />
                    </Link>
                    <Link
                        href={siteConfig.links.youtube}
                        className="rounded-full bg-secondary p-3"
                    >
                        <Icons.youtube className="h-4 w-4" />
                    </Link>
                    <Link
                        href={siteConfig.links.github}
                        className="rounded-full bg-secondary p-3"
                    >
                        <Icons.github className="h-4 w-4" />
                    </Link>
                    <Link
                        href={siteConfig.links.discord}
                        className="rounded-full bg-secondary p-3"
                    >
                        <Icons.discord className="h-4 w-4" />
                    </Link>
                    <Link
                        href={siteConfig.links.instagram}
                        className="rounded-full bg-secondary p-3"
                    >
                        <Icons.instagram className="h-4 w-4" />
                    </Link>
                </div>
                <p className="text-sm">
                    Copyright © 2023{" "}
                    <Link
                        href={siteConfig.url}
                        className="font-semibold text-accent-foreground underline underline-offset-2"
                    >
                        DRVGO
                    </Link>
                    , All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export { DashFooter };
