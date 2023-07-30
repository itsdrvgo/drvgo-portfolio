import DRVGOLogo from "@/public/DRVGO.svg";
import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "../icons/icons";
import { Button } from "../ui/button";

function SiteFooter({ className }: DefaultProps) {
    return (
        <footer
            className={cn(
                "relative flex w-full flex-col items-center justify-center space-y-20 border-t border-border bg-background py-10",
                className
            )}
        >
            <div className="absolute top-0 mx-5 grid max-w-[75rem] -translate-y-1/2 grid-cols-1 items-center gap-5 rounded-md bg-accent-foreground px-8 py-5 text-center md:grid-cols-3 md:gap-10 md:px-16 md:py-10">
                <p className="text-2xl font-bold text-background md:text-4xl">
                    Start a Project
                </p>
                <p className="text-sm font-medium text-background">
                    Interested in working together? We can have a chat, and make
                    something unthinkable!
                </p>
                <div className="flex items-center justify-center md:justify-end">
                    <Button
                        variant={"secondary"}
                        className="flex items-center gap-1 hover:bg-zinc-800"
                    >
                        <Icons.sparkles className="h-4 w-4" />
                        <p>Let&apos;s go</p>
                    </Button>
                </div>
            </div>

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

export { SiteFooter };
